// export function loadRazorpayScript() {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

/**
 * Dynamically loads Razorpay checkout.js script
 * Returns: Promise<boolean> - true if loaded successfully, false otherwise
 */

// src/utils/razorpayUtils.js

// src/utils/razorpayUtils.js

/**
 * Dynamically loads the Razorpay Checkout script
 * Returns: Promise<boolean> - true if loaded successfully, false otherwise
 */
/**
 * Loads the Razorpay script dynamically
 * Returns: Promise<boolean> - true if loaded successfully, false otherwise
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
