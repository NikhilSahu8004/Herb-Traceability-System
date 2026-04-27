export const blockchainService = {
  previewAnchor(payload) {
    return `Preview anchor prepared for ${payload.batchCode} with process ${payload.processCode}.`;
  }
};
