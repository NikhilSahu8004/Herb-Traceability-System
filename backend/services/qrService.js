import QRCode from "qrcode";

function makeTracePayload(payload) {
  return JSON.stringify({
    batchCode: payload.batchCode,
    batchNo: payload.batchNo,
    herbName: payload.herbName,
    region: payload.region || payload.origin?.region,
    generatedAt: new Date().toISOString()
  });
}

async function makeQrPng(payload) {
  const dataUrl = await QRCode.toDataURL(payload, {
    margin: 1,
    width: 280
  });

  return Buffer.from(dataUrl.split(",")[1], "base64");
}

export const qrService = {
  makeTracePayload,
  makeQrPng
};
