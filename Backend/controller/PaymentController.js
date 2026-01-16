import Razorpay from "razorpay";
import crypto from "crypto";
import Intern from "../model/RegisterDB/internSchema.js";
import Interndata from "../model/interndata.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const purchasePlan = async (req, res) => {
  try {
    const internId = req.user.id;

    const {
      purchaseCategory,
      amount,
      packageType,
      creditsGiven,
      maxPackageLPA,
      courseType,
      totalSessions,
      liveSessions,
      recordedSessions
    } = req.body;

    if (!purchaseCategory || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment fields"
      });
    }

    /* =====================================================
       🔐 SILVER PACKAGE VALIDATION
    ====================================================== */
    if (purchaseCategory === "JOB_PACKAGE" && packageType === "Silver") {

      // ✅ get intern email + purchases
      const intern = await Intern.findById(internId).select("email purchases");

      if (!intern) {
        return res.status(404).json({
          success: false,
          message: "Intern not found"
        });
      }

      const internEmail = intern.email?.trim().toLowerCase();
      console.log("Intern Email:", internEmail);

      // ❌ block if email not found in Excel-uploaded data
      const emailExists = await Interndata.exists({
        Email: internEmail
      });

      console.log("Email exists in interndata:", emailExists);

      if (!emailExists) {
        return res.status(403).json({
          success: false,
          message:
            "You are not eligible for the Silver package. Email not found in approved list."
        });
      }

      // ❌ block if Silver already purchased
      const alreadyPurchasedSilver = intern.purchases?.some(
        (p) =>
          p.purchaseCategory === "JOB_PACKAGE" &&
          p.jobPackageDetails?.packageType === "Silver" &&
          p.paymentStatus === "SUCCESS"
      );

      if (alreadyPurchasedSilver) {
        return res.status(403).json({
          success: false,
          message: "Silver package can be purchased only once."
        });
      }
    }

    /* =====================================================
       💳 CREATE RAZORPAY ORDER
    ====================================================== */
    const options = {
      amount, // paise
      currency: "INR",
      receipt: `rcpt_${internId.slice(-5)}_${Date.now()}`,
      notes: {
        internId,
        purchaseCategory,
        packageType,
        courseType
      }
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderData: {
        purchaseCategory,
        packageType,
        creditsGiven,
        maxPackageLPA,
        courseType,
        totalSessions,
        liveSessions,
        recordedSessions,
        amountPaid: amount / 100
      }
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order"
    });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const internId = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found"
      });
    }

    // 🧾 Build purchase object
    const purchase = {
      purchaseCategory: orderData.purchaseCategory,
      amountPaid: orderData.amountPaid,
      paymentId: razorpay_payment_id,
      paymentStatus: "SUCCESS",
    };

    if (orderData.purchaseCategory === "JOB_PACKAGE") {
      purchase.jobPackageDetails = {
        packageType: orderData.packageType,
        creditsGiven: orderData.creditsGiven,
        creditsRemaining: orderData.creditsGiven,
        maxPackageLPA: orderData.maxPackageLPA
      };
    }

    if (orderData.purchaseCategory === "COURSE") {
      purchase.courseDetails = {
        courseType: orderData.courseType,
        totalSessions: orderData.totalSessions,
        liveSessions: orderData.liveSessions,
        recordedSessions: orderData.recordedSessions
      };
    }

    intern.purchases.push(purchase);
    await intern.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified & purchase activated"
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};


//get current plan
export const getCurrentPlan = async (req, res) => {
  try {
    const intern = await Intern.findById(req.user.id);
    if (!intern) {
      return res.status(404).json({ success: false });
    }

    // 🔢 Calculate job credits
    const jobCredits = intern.purchases
      .filter(p => p.purchaseCategory === "JOB_PACKAGE")
      .reduce((sum, p) => sum + (p.jobPackageDetails?.creditsRemaining || 0), 0);

    // 🎓 Purchased courses
    const purchasedCourses = intern.purchases
      .filter(p => p.purchaseCategory === "COURSE")
      .map(p => p.courseDetails);

    return res.status(200).json({
      success: true,
      jobCredits,
      purchasedCourses,
      activePlans: intern.purchases
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};


//get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const intern = await Intern.findById(req.user.id);
    if (!intern) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      paymentHistory: intern.purchases.sort(
        (a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt)
      )
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

