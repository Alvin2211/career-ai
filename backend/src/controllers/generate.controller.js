import { ApiError } from "../utils/ApiError.js";
import puppeteer from 'puppeteer';
import axios from "axios";

function generatehtml(data) {

    const safe = (val) => val ? val : "";

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
  }

  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.25;
    color: #000;
    margin: 0;
  }

  .name {
    text-align: center;
    font-size: 20pt;
    font-weight: bold;
    margin-bottom: 3px;
  }

  .contact {
    text-align: center;
    font-size: 10.5pt;
    margin-bottom: 14px;
  }

  .section-title {
    font-weight: bold;
    font-size: 11.5pt;
    margin-top: 18px;
    margin-bottom: 4px;
    padding-bottom: 2px;
    border-bottom: 0.8px solid #000;
    letter-spacing: 0.5px;
  }

  .entry {
    margin-bottom: 8px;
  }

  .row {
    display: flex;
    justify-content: space-between;
  }

  .left {
    font-weight: bold;
  }

  .right {
    text-align: right;
  }

  .subrow {
    display: flex;
    justify-content: space-between;
  }

  .sub-left {
    font-style: italic;
  }

  ul {
    margin: 4px 0 4px 18px;
    padding: 0;
  }

  li {
    margin-bottom: 3px;
  }

</style>
</head>

<body>

<div class="name">${safe(data.name)}</div>

<div class="contact">
  ${safe(data.location)} |
  ${safe(data.phone)} |
  ${safe(data.email)} |
  ${safe(data.linkedin)}
</div>

<!-- EDUCATION -->
${data.education && data.education.length ? `
<div class="section-title">EDUCATION</div>
${data.education.map(edu => `
  <div class="entry">
    <div class="row">
      <div class="left">${safe(edu.school)}</div>
      <div class="right">${safe(edu.location)}</div>
    </div>
    <div class="subrow">
      <div>${safe(edu.degree)}</div>
      <div>${safe(edu.startDate)} – ${safe(edu.endDate)}</div>
    </div>
  </div>
`).join("")}
` : ""}

<!-- EXPERIENCE -->
${data.experience && data.experience.length ? `
<div class="section-title">EXPERIENCE</div>
${data.experience.map(exp => `
  <div class="entry">
    <div class="row">
      <div class="left">${safe(exp.role)}</div>
      <div class="right">${safe(exp.startDate)} – ${safe(exp.endDate)}</div>
    </div>
    <div class="subrow">
      <div class="sub-left">${safe(exp.company)}</div>
      <div>${safe(exp.location)}</div>
    </div>
    ${exp.bullets && exp.bullets.length ? `
    <ul>
      ${exp.bullets.map(b => `<li>${safe(b)}</li>`).join("")}
    </ul>
    ` : ""}
  </div>
`).join("")}
` : ""}

<!-- PROJECTS -->
${data.projects && data.projects.length ? `
<div class="section-title">PROJECTS</div>
${data.projects.map(proj => `
  <div class="entry">
    <div class="row">
      <div class="left">${safe(proj.name)}</div>
      <div class="right">${safe(proj.startDate)} – ${safe(proj.endDate)}</div>
    </div>
    ${proj.bullets && proj.bullets.length ? `
    <ul>
      ${proj.bullets.map(b => `<li>${safe(b)}</li>`).join("")}
    </ul>
    ` : ""}
  </div>
`).join("")}
` : ""}

<!-- TECHNICAL SKILLS -->
<div class="section-title">TECHNICAL SKILLS</div>
<div class="entry">
  <div><strong>Languages:</strong> ${safe(data.languages)}</div>
  <div><strong>Tools:</strong> ${safe(data.tools)}</div>
</div>

</body>
</html>
`;
}
const genresume = async (req, res) => {
    try {
        const userData = req.body;
        if (!userData) {
            throw new ApiError(400, "No data provided");
        }
        console.log(userData);
        const html = generatehtml(userData);
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdfbuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            waitForFonts: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
        res.send(pdfbuffer);

    } catch (error) {
        console.log("Error:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}


export { genresume };