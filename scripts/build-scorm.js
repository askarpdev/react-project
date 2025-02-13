const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// SCORM manifest template
const manifestTemplate = `<?xml version="1.0" standalone="no" ?>
<manifest identifier="TempoCoursePkg" version="1"
         xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
         xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                             http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                             http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>Tempo Course</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>Course Content</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

// SCORM API wrapper template
const scormWrapperTemplate = `
// SCORM API Interface
let API = null;

function findAPI(win) {
  if (win.API) return win.API;
  if (win.parent && win.parent !== win) return findAPI(win.parent);
  return null;
}

function initializeSCORM() {
  API = findAPI(window);
  if (API) {
    API.LMSInitialize("");
    API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    API.LMSCommit("");
  }
}

function completeSCORM() {
  if (API) {
    API.LMSSetValue("cmi.core.lesson_status", "completed");
    API.LMSCommit("");
    API.LMSFinish("");
  }
}

// Initialize SCORM when the page loads
window.addEventListener('load', initializeSCORM);

// Complete SCORM when the user closes the window
window.addEventListener('beforeunload', completeSCORM);
`;

async function buildSCORMPackage() {
  try {
    // 1. Build the preview version
    console.log("Building preview version...");
    execSync("npm run build", { stdio: "inherit" });

    // 2. Create SCORM package directory
    const scormDir = path.join(process.cwd(), "scorm-package");
    if (fs.existsSync(scormDir)) {
      fs.rmSync(scormDir, { recursive: true });
    }
    fs.mkdirSync(scormDir);

    // 3. Copy build files to SCORM package
    console.log("Copying build files...");
    fs.cpSync(path.join(process.cwd(), "dist"), scormDir, { recursive: true });

    // 4. Create imsmanifest.xml
    console.log("Creating SCORM manifest...");
    fs.writeFileSync(path.join(scormDir, "imsmanifest.xml"), manifestTemplate);

    // 5. Inject SCORM API wrapper into index.html
    console.log("Injecting SCORM API wrapper...");
    const indexPath = path.join(scormDir, "index.html");
    let indexContent = fs.readFileSync(indexPath, "utf8");

    // Insert SCORM wrapper script before the closing body tag
    const scormScript = `<script>${scormWrapperTemplate}</script>`;
    indexContent = indexContent.replace("</body>", `${scormScript}</body>`);
    fs.writeFileSync(indexPath, indexContent);

    console.log("SCORM package created successfully!");
    console.log(`Package location: ${scormDir}`);
    console.log("You can now zip this directory and upload it to your LMS.");
  } catch (error) {
    console.error("Error building SCORM package:", error);
    process.exit(1);
  }
}

buildSCORMPackage();
