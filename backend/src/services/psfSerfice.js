import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";
//here creating the pdf of the html certificate. using puppeteer, and ejs.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const toBase64 = (filePath) => {
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString("base64");
};

//this one creates the pdf, and converts it to an image for easy preview.
async function generateCertificatePreview(data) {
  // 1. Prepare Base64 assets
  const logoImage = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/logo.png")
  )}`;
  const sigYoussef = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/youssef.png")
  )}`;
  const sigIbrahim = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/ibrahim.png")
  )}`;
  const sigJalilah = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/al-jalilah.png")
  )}`;
  const radleyFont = `data:font/ttf;base64,${toBase64(
    path.join(__dirname, "../assets/Radley-Regular.ttf")
  )}`;
  const brittanyFont = `data:font/ttf;base64,${toBase64(
    path.join(__dirname, "../assets/BrittanySignature.ttf")
  )}`;
  // Fixed MIME type to image/bmp
  const designImage = `data:image/bmp;base64,${toBase64(
    path.join(__dirname, "../assets/design.bmp")
  )}`;

  // 2. Render HTML
  const templatePath = path.join(
    __dirname,
    "../views/pdf-templates/certificate.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    ...data,
    logoImage,
    radleyFont,
    brittanyFont,
    designImage,
    sigYoussef,
    sigIbrahim,
    sigJalilah,
  });

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Set a viewport that matches A4 proportions
  await page.setViewport({ width: 1122, height: 794 });
  await page.setContent(html, {
    waitUntil: "load", // "load" is faster and doesn't wait for network idle
    timeout: 0, // This disables the 30s timeout limit
  });

  // Take a low-quality screenshot
  const imageBuffer = await page.screenshot({
    type: "jpeg",
    quality: 50,
    fullPage: true,
  });

  await browser.close();
  return imageBuffer;
}
//this one creates tthe pdf and send it back.
async function generateCertificatePDF(data) {
  // 1. Prepare Base64 assets
  const logoImage = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/logo.png")
  )}`;
  const sigYoussef = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/youssef.png")
  )}`;
  const sigIbrahim = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/ibrahim.png")
  )}`;
  const sigJalilah = `data:image/png;base64,${toBase64(
    path.join(__dirname, "../assets/al-jalilah.png")
  )}`;
  const radleyFont = `data:font/ttf;base64,${toBase64(
    path.join(__dirname, "../assets/Radley-Regular.ttf")
  )}`;
  const brittanyFont = `data:font/ttf;base64,${toBase64(
    path.join(__dirname, "../assets/BrittanySignature.ttf")
  )}`;
  // Fixed MIME type to image/bmp
  const designImage = `data:image/bmp;base64,${toBase64(
    path.join(__dirname, "../assets/design.bmp")
  )}`;

  // 2. Render HTML
  const templatePath = path.join(
    __dirname,
    "../views/pdf-templates/certificate.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    ...data,
    logoImage,
    radleyFont,
    brittanyFont,
    designImage,
    sigYoussef,
    sigIbrahim,
    sigJalilah,
  });

  // 3. Run Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Good for server compatibility
  });
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "load", // "load" is faster and doesn't wait for network idle
    timeout: 0, // This disables the 30s timeout limit
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  return pdfBuffer;
}

export { generateCertificatePDF, generateCertificatePreview };
