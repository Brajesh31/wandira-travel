import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

const uploadImg = async (file) => {
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("https://wandria-server-production.up.railway.app/auth/image-kit");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  try {
    const authParams = await authenticator();
    const { signature, expire, token, publicKey } = authParams;

    const uploadResponse = await upload({
      expire,
      token,
      signature,
      publicKey,
      file,
      fileName: file.name,
      abortSignal: abortController.signal,
    });

    return {
      success: true,
      data: uploadResponse,
      error: null,
      abort: () => abortController.abort(),
    };
  } catch (error) {
    let errorMessage = "Upload failed";
    let errorType = "unknown";

    if (error instanceof ImageKitAbortError) {
      errorMessage = `Upload aborted: ${error.reason}`;
      errorType = "aborted";
    } else if (error instanceof ImageKitInvalidRequestError) {
      errorMessage = `Invalid request: ${error.message}`;
      errorType = "invalid_request";
    } else if (error instanceof ImageKitUploadNetworkError) {
      errorMessage = `Network error: ${error.message}`;
      errorType = "network_error";
    } else if (error instanceof ImageKitServerError) {
      errorMessage = `Server error: ${error.message}`;
      errorType = "server_error";
    } else {
      errorMessage = error.message || "Unknown upload error";
      errorType = "general_error";
    }

    return {
      success: false,
      data: null,
      error: {
        message: errorMessage,
        type: errorType,
        originalError: error,
      },
      abort: () => abortController.abort(),
    };
  }
};

const handleFileUpload = async (file) => {
  try {
    const result = await uploadImg(file, "my-image.jpg");
    return result.data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return error.message
  }
};

export default handleFileUpload;
