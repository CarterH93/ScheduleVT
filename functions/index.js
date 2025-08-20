/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Dependencies for callable functions.
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const { setGlobalOptions } = require("firebase-functions");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 5 });

exports.VTTimetableRequest = onCall(async (request) => {
  try {
    const requestData = request.data.requestData;
    const requestType = request.data.requestType;
    // Authentication / user information is automatically added to the request.
    const auth = request.auth;

    let text;

    if (!auth) {
      throw new HttpsError(
        "unauthenticated",
        "user not authenticated, could not access VTTimetable API"
      );
    }

    const url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest";

    let formData = new URLSearchParams();
    if (requestType === "POST") {
      if (requestData) {
        for (const [key, value] of Object.entries(requestData)) {
          formData.append(key, value);
        }
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      text = await response.text();
    } else {
      const response = await fetch(url);
      text = await response.text();
    }

    if (text.includes("THERE IS AN ERROR WITH YOUR REQUEST")) {
      throw new HttpsError(
        "invalid-argument",
        "The search parameters provided were invalid" + formData.toString()
      );
    }

    if (text.includes("There was a problem with your request")) {
      if (text.includes("NO SECTIONS FOUND FOR THIS INQUIRY")) {
        return "";
      } else {
        throw new HttpsError(
          "aborted",
          "There was a problem with your request: " + text
        );
      }
    }

    return text;
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error; // Re-throw known HttpsErrors
    }
    throw new HttpsError("internal", error.message);
  }
});
