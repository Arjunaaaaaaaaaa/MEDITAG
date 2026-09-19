const STORAGE_KEY="meditag_v3_patient";
const LOG_KEY="meditag_v3_logs";
const SESSION_KEY="meditag_v3_session";

const DEMO_PATIENT={
  patientId:"MT-1001",
  token:"demo-ananya-1001",
  name:"Ananya Rao",
  dob:"2005-04-12",

  blood:"O+",
  phone:"+91 98765 43210",

  email:"PATIENT_EMAIL",
  emergencyContactEmail:"EMERGENCY_EMAIL",

  emergency:"Rahul Rao — +91 98765 43210",
  emergencyNumber:"+91 98765 43210",

  conditions:"Asthma",
  allergies:"Penicillin",
  medications:"Salbutamol inhaler",

  history:"Asthma diagnosed in childhood. No major surgeries.",

  advice:"Take the prescribed medicine after food twice daily. Drink sufficient water and return for review after 7 days.",

  tamilAdvice:"பரிந்துரைக்கப்பட்ட மருந்தை உணவுக்குப் பிறகு தினமும் இரண்டு முறை எடுத்துக்கொள்ளுங்கள். போதுமான அளவு தண்ணீர் குடிக்கவும். 7 நாட்களுக்குப் பிறகு மீண்டும் பரிசோதனைக்கு வாருங்கள்.",

  notes:"Initial demo consultation."
};

let currentPatient=null;
let currentDoctor=null;
let currentScanToken=null;
let qrScanner=null;


/* =========================
   BASIC HELPERS
========================= */

function esc(s=""){
  return String(s).replace(
    /[&<>"']/g,
    c=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[c])
  );
}


/*
  IMPORTANT:
  Merge the stored patient with DEMO_PATIENT.

  This fixes old localStorage records that were created
  before the email fields were added.
*/
function getPatient(){
  const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");

  if(stored){
    return {
      ...DEMO_PATIENT,
      ...stored,

      email:stored.email || DEMO_PATIENT.email,
      emergencyContactEmail:
        stored.emergencyContactEmail || DEMO_PATIENT.emergencyContactEmail
    };
  }

  return DEMO_PATIENT;
}

function setPatient(p){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(p));
}

function getLogs(){
  return JSON.parse(localStorage.getItem(LOG_KEY)||"[]");
}

function setLogs(x){
  localStorage.setItem(LOG_KEY,JSON.stringify(x));
}

function addLog(type,details,patientId=getPatient().patientId){
  const logs=getLogs();

  logs.unshift({
    type,
    details,
    time:new Date().toLocaleString(
      "en-IN",
      {
        dateStyle:"medium",
        timeStyle:"short"
      }
    ),
    patientId
  });

  setLogs(logs);
}

function patientLogs(){
  return getLogs().filter(
    x=>x.patientId===getPatient().patientId
  );
}

function getSession(){
  return JSON.parse(
    sessionStorage.getItem(SESSION_KEY)||"null"
  );
}

function setSession(s){
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(s)
  );
}

function clearSession(){
  sessionStorage.removeItem(SESSION_KEY);
}

function showView(id){
  document
    .querySelectorAll(".view")
    .forEach(v=>v.classList.remove("active"));

  const el=document.getElementById(id);

  if(el) el.classList.add("active");

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}

function logout(){
  clearSession();
  currentPatient=null;
  currentDoctor=null;
  stopCamera();
  showView("landing");
}

function normalize(v){
  return String(v||"")
    .replace(/\s+/g," ")
    .trim()
    .toLowerCase();
}

function createPatientId(){
  const n=Number(
    localStorage.getItem("meditag_v3_next_id")||1001
  );

  localStorage.setItem(
    "meditag_v3_next_id",
    String(n+1)
  );

  return "MT-"+n;
}

function createToken(){
  if(crypto.randomUUID)
    return crypto.randomUUID();

  return "mt-"+Date.now()+"-"+
    Math.random().toString(16).slice(2);
}


/* =========================
   PATIENT REGISTRATION
========================= */

document
  .getElementById("registrationForm")
  .addEventListener("submit",e=>{

  e.preventDefault();

  const patient={
    patientId:createPatientId(),
    token:createToken(),

    name:document.getElementById("regName").value.trim(),
    dob:document.getElementById("regDob").value,
    blood:document.getElementById("regBlood").value,
    phone:document.getElementById("regPhone").value.trim(),

    emergency:
      document.getElementById("regEmergency").value.trim(),

    emergencyNumber:
      document.getElementById("regEmergencyNumber").value.trim(),

    /*
      For this demo registration flow, use the MediTag
      demo email addresses.
    */
    email:DEMO_PATIENT.email,
    emergencyContactEmail:
      DEMO_PATIENT.emergencyContactEmail,

    conditions:
      document.getElementById("regConditions").value.trim(),

    allergies:
      document.getElementById("regAllergies").value.trim(),

    medications:
      document.getElementById("regMedications").value.trim(),

    history:
      document.getElementById("regHistory").value.trim(),

    advice:"",
    tamilAdvice:"",
    notes:"",
    updates:[]
  };

  setPatient(patient);
  setLogs([]);

  addLog(
    "Registration",
    "MediTag profile created."
  );

  document
    .getElementById("registrationForm")
    .classList.add("hidden");

  document
    .getElementById("registrationSuccess")
    .classList.remove("hidden");

  document
    .getElementById("createdPatientId")
    .textContent=
      `Patient ID: ${patient.patientId}`;
});


/* =========================
   PATIENT LOGIN
========================= */

function patientLogin(){

  const id=normalize(
    document.getElementById("patientLoginId").value
  );

  const otp=
    document.getElementById("patientOtp").value.trim();

  const p=getPatient();

  const match=
    id===normalize(p.patientId) ||
    id===normalize(p.phone);

  const status=
    document.getElementById("patientLoginStatus");

  if(!match){
    status.textContent=
      "Patient not found. Use the registered phone number or Patient ID.";
    return;
  }

  if(otp!=="111222"){
    status.textContent=
      "Incorrect demo OTP. Use 111222.";
    return;
  }

  currentPatient=p;

  setSession({
    role:"patient",
    patientId:p.patientId
  });

  addLog(
    "Patient login",
    "Patient authenticated and opened their dashboard.",
    p.patientId
  );

  renderPatientDashboard();

  showView("patientDashboard");
}


/* =========================
   DOCTOR LOGIN
========================= */

function doctorLogin(){

  const id=
    document.getElementById("doctorLoginId").value.trim();

  const pass=
    document.getElementById("doctorPassword").value.trim();

  const otp=
    document.getElementById("doctorOtp").value.trim();

  const status=
    document.getElementById("doctorLoginStatus");

  if(!id){
    status.textContent="Enter a Doctor ID.";
    return;
  }

  if(pass!=="MEDI123"){
    status.textContent=
      "Incorrect demo verification. Use MEDI123.";
    return;
  }

  if(otp!=="333444"){
    status.textContent=
      "Incorrect demo OTP. Use 333444.";
    return;
  }

  currentDoctor={
    doctorId:id
  };

  setSession({
    role:"doctor",
    doctorId:id
  });

  showView("doctorDashboard");

  document
    .getElementById("doctorWelcome")
    .textContent=id;

  addLog(
    "Doctor login",
    `${id} authenticated.`
  );
}


/* =========================
   PATIENT DASHBOARD
========================= */

function renderPatientDashboard(){

  const p=getPatient();

  currentPatient=p;

  document
    .getElementById("patientWelcome")
    .textContent=
      `Welcome, ${p.name}`;

  document
    .getElementById("patientMeta")
    .textContent=
      `Patient ID: ${p.patientId} • ${p.phone}`;

  document
    .getElementById("patientProfileCard")
    .innerHTML=[

      ["Name",p.name],
      ["Date of birth",p.dob],
      ["Blood group",p.blood],
      ["Phone",p.phone],

      [
        "Emergency contact",
        p.emergency
      ],

      [
        "Additional emergency number",
        p.emergencyNumber||"Not provided"
      ],

      [
        "Medical conditions",
        p.conditions||"None recorded"
      ],

      [
        "Allergies",
        p.allergies||"None recorded"
      ],

      [
        "Current medications",
        p.medications||"None recorded"
      ],

      [
        "Medical history",
        p.history||"None recorded"
      ]

    ]
    .map(
      ([k,v])=>
        `<div class="profileItem">
          <b>${esc(k)}</b>
          <span>${esc(v)}</span>
        </div>`
    )
    .join("");

  renderPatientQR();
  renderPatientLogs();
  renderPatientUpdates();

  const advice=
    p.advice||
    "No doctor advice has been added yet.";

  document
    .getElementById("careEnglish")
    .textContent=advice;

  document
    .getElementById("careTamil")
    .textContent=
      p.tamilAdvice||
      "மருத்துவர் ஆலோசனை இன்னும் சேர்க்கப்படவில்லை.";

  document
    .getElementById("speakTamil")
    .disabled=!p.tamilAdvice;
}


/* =========================
   QR
========================= */

function renderPatientQR(){

  const box=
    document.getElementById("patientQRBox");

  box.innerHTML="";

  new QRCode(
    box,
    {
      text:"MEDI-TAG:"+getPatient().token,
      width:220,
      height:220,
      colorDark:"#17323a",
      colorLight:"#ffffff",
      correctLevel:QRCode.CorrectLevel.M
    }
  );

  document
    .getElementById("patientToken")
    .textContent=
      "MEDI-TAG:"+getPatient().token;
}

function downloadPatientQR(){

  const img=
    document.querySelector("#patientQRBox img");

  const canvas=
    document.querySelector("#patientQRBox canvas");

  if(!img&&!canvas)
    return alert("QR is not ready.");

  const a=document.createElement("a");

  a.href=
    canvas
      ?canvas.toDataURL("image/png")
      :img.src;

  a.download="MediTag-QR.png";

  a.click();

  addLog(
    "QR downloaded",
    "Patient downloaded their MediTag QR."
  );

  renderPatientLogs();
}

function printPatientQR(){

  const p=getPatient();

  const qr=
    document.getElementById("patientQRBox")
      .innerHTML;

  const w=
    window.open(
      "",
      "_blank",
      "width=650,height=750"
    );

  if(!w)
    return alert(
      "Please allow pop-ups to print."
    );

  w.document.write(`
    <html>
      <head>
        <title>MediTag QR</title>

        <style>
          body{
            font-family:Arial;
            text-align:center;
            padding:40px;
            color:#17323a
          }

          .card{
            border:2px solid #0f766e;
            border-radius:20px;
            padding:30px;
            max-width:420px;
            margin:auto
          }

          img{
            width:230px
          }
        </style>
      </head>

      <body>

        <div class="card">

          <h1>MEDI<strong>TAG</strong></h1>

          <h2>${esc(p.name)}</h2>

          ${qr}

          <p>
            <b>Patient ID:</b>
            ${esc(p.patientId)}
          </p>

          <small>
            QR contains MediTag token only.
          </small>

        </div>

        <script>
          window.onload=()=>window.print()
        <\/script>

      </body>
    </html>
  `);

  w.document.close();

  addLog(
    "QR printed",
    "Patient opened printable QR."
  );
}


/* =========================
   PATIENT LOGS
========================= */

function renderPatientLogs(){

  const box=
    document.getElementById("patientLogs");

  const logs=patientLogs();

  box.innerHTML=
    logs.length
      ?logs.slice(0,30)
        .map(
          l=>
            `<div class="recordRow">
              <b>${esc(l.type)}</b>
              <br>
              <small>${esc(l.time)}</small>
              <br>
              ${esc(l.details)}
            </div>`
        )
        .join("")
      :"No access events yet.";
}

function renderPatientUpdates(){

  const p=getPatient();

  const box=
    document.getElementById("patientUpdates");

  const updates=p.updates||[];

  box.innerHTML=
    updates.length
      ?updates
        .slice()
        .reverse()
        .map(
          u=>
            `<div class="updateItem">
              <b>${esc(u.title)}</b>
              <span>${esc(u.time)}</span>
              <p>${esc(u.details)}</p>
            </div>`
        )
        .join("")
      :"No doctor-updated information yet.";
}

function speakTamil(){

  const text=getPatient().tamilAdvice;

  if(!text)return;

  speechSynthesis.cancel();

  const u=
    new SpeechSynthesisUtterance(text);

  u.lang="ta-IN";

  speechSynthesis.speak(u);

  addLog(
    "Tamil care summary",
    "Patient listened to doctor advice in Tamil."
  );

  renderPatientLogs();
}


/* =========================
   EMERGENCY SOS
========================= */

function extractPhoneFromEmergency(s){

  const m=
    String(s||"")
      .match(/(\+?\d[\d\s-]{7,}\d)/);

  return m
    ?m[1].trim()
    :null;
}

function maskNumber(n){

  const s=
    String(n||"")
      .replace(/\s+/g,"");

  if(s.length<4)return s;

  return s
    .slice(0,-4)
    .replace(/\d/g,"•")+
    s.slice(-4);
}

function emergencyNumberOnFile(p){

  return p.emergencyNumber||
    extractPhoneFromEmergency(p.emergency);
}

function openEmergencySOS(){

  const p=getPatient();

  const num=
    emergencyNumberOnFile(p);

  document
    .getElementById("emergencyIntro")
    .textContent=num
      ?`A verification code will be sent to the registered emergency email. Verifying it will alert ${p.emergency||"your emergency contact"}.`
      :"No additional emergency number is on file. Please update your registration.";

  document
    .getElementById("emergencyStep1")
    .classList.toggle(
      "hidden",
      !num
    );

  document
    .getElementById("emergencyStep2")
    .classList.add("hidden");

  document
    .getElementById("emergencySuccess")
    .classList.add("hidden");

  document
    .getElementById("emergencyOtpInput")
    .value="";

  document
    .getElementById("emergencyStatus")
    .textContent="";

  document
    .getElementById("emergencyOverlay")
    .classList.remove("hidden");
}

function closeEmergencySOS(){

  document
    .getElementById("emergencyOverlay")
    .classList.add("hidden");
}


/*
  REAL EMERGENCY OTP

  Browser
      ↓
  Node/Express
      ↓
  Resend
      ↓
  Email inbox
*/

async function sendEmergencyOtp(){

  const p=getPatient();

  const num=
    emergencyNumberOnFile(p);

  const status=
    document.getElementById("emergencyStatus");

  if(!num){

    status.textContent=
      "No emergency number on file.";

    return;
  }

  /*
    Because getPatient() now merges old localStorage
    data with DEMO_PATIENT, these will always exist
    for the current demo patient.
  */

  const patientEmail=
    p.email ||
    DEMO_PATIENT.email;

  const emergencyContactEmail=
    p.emergencyContactEmail ||
    DEMO_PATIENT.emergencyContactEmail;

  if(!patientEmail ||
     !emergencyContactEmail){

    status.textContent=
      "Emergency email configuration is missing.";

    return;
  }

  status.textContent=
    "Sending emergency verification code...";

  try{

    const response=
      await fetch(
        "http://localhost:3000/send-emergency-otp",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({

            patientEmail:
              patientEmail,

            emergencyContactEmail:
              emergencyContactEmail

          })
        }
      );

    const result=
      await response.json();

    if(!response.ok ||
       !result.success){

      status.textContent=
        result.message||
        "Could not send emergency OTP.";

      return;
    }

    document
      .getElementById("emergencyStep1")
      .classList.add("hidden");

    document
      .getElementById("emergencyStep2")
      .classList.remove("hidden");

    status.textContent=
      `Verification code sent to the registered email.`;

    addLog(
      "Emergency SOS triggered",
      "Emergency verification code sent to registered email."
    );

    renderPatientLogs();

  }catch(error){

    console.error(
      "Emergency OTP error:",
      error
    );

    status.textContent=
      "Could not connect to the MediTag emergency server. Make sure the Node server is running.";
  }
}


/*
  REAL OTP VERIFICATION

  The OTP is NOT stored in the browser anymore.

  Verification happens on the Node server.
*/

async function verifyEmergencyOtp(){

  const entered=
    document
      .getElementById("emergencyOtpInput")
      .value
      .trim();

  const status=
    document.getElementById("emergencyStatus");

  const p=getPatient();

  if(!entered){

    status.textContent=
      "Enter the verification code.";

    return;
  }

  status.textContent=
    "Verifying code...";

  try{

    const response=
      await fetch(
        "http://localhost:3000/verify-emergency-otp",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({

            patientEmail:
              p.email ||
              DEMO_PATIENT.email,

            otp:entered

          })
        }
      );

    const result=
      await response.json();

    if(!response.ok ||
       !result.success){

      status.textContent=
        result.message||
        "Invalid verification code.";

      return;
    }

    document
      .getElementById("emergencyStep2")
      .classList.add("hidden");

    document
      .getElementById("emergencySuccess")
      .classList.remove("hidden");

    document
      .getElementById("emergencySuccessText")
      .textContent=
        `${p.emergency||"Your emergency contact"} has been alerted with your MediTag profile.`;

    addLog(
      "Emergency alert confirmed",
      "Emergency verification code successfully verified; emergency access confirmed."
    );

    renderPatientLogs();

  }catch(error){

    console.error(
      "Emergency verification error:",
      error
    );

    status.textContent=
      "Could not connect to the MediTag emergency server.";
  }
}


/* =========================
   PATIENT DASHBOARD TABS
========================= */

document
  .querySelectorAll(".tab")
  .forEach(
    b=>
      b.addEventListener(
        "click",
        ()=>{
          document
            .querySelectorAll(".tab")
            .forEach(
              x=>
                x.classList.toggle(
                  "active",
                  x===b
                )
            );

          document
            .querySelectorAll(
              "#patientDashboard .panel"
            )
            .forEach(
              x=>
                x.classList.toggle(
                  "active",
                  x.id===b.dataset.tab
                )
            );
        }
      )
  );


/* =========================
   QR SCANNING
========================= */

function parseMediTag(text){

  const m=
    String(text||"")
      .trim()
      .match(/^MEDI-TAG:(.+)$/i);

  return m
    ?m[1].trim()
    :null;
}

function findPatientByToken(token){

  return token===getPatient().token
    ?getPatient()
    :null;
}

function handleScan(text){

  const token=
    parseMediTag(text);

  const result=
    document.getElementById(
      "doctorScanResult"
    );

  if(!token){

    result.classList.remove("hidden");

    result.innerHTML=
      "<b>Invalid QR.</b> This is not a MediTag token.";

    return;
  }

  currentScanToken=token;

  const p=
    findPatientByToken(token);

  result.classList.remove("hidden");

  if(!p){

    result.innerHTML=
      "<b>Patient not found.</b> The token was read, but no matching demo patient exists.";

    document
      .getElementById("doctorRecord")
      .classList.add("hidden");

    document
      .getElementById("scannerStatus")
      .textContent=
        "Token read — patient not found.";

    return;
  }

  document
    .getElementById("scannerStatus")
    .textContent=
      "Patient found.";

  result.innerHTML=
    `<b>✓ Patient found</b><br>
     ${esc(p.name)} • ${esc(p.patientId)}
     <br>
     <small>
       Doctor is authenticated. Patient record can now be opened.
     </small>`;

  openDoctorRecord(p);
}

function openDoctorRecord(p){

  currentPatient=p;

  document
    .getElementById("doctorRecord")
    .classList.remove("hidden");

  document
    .getElementById("doctorPatientName")
    .textContent=p.name;

  document
    .getElementById("doctorPatientId")
    .textContent=
      `${p.patientId} • ${p.phone}`;

  renderDoctorRead(p);

  document
    .getElementById("docConditions")
    .value=p.conditions||"";

  document
    .getElementById("docAllergies")
    .value=p.allergies||"";

  document
    .getElementById("docMedications")
    .value=p.medications||"";

  document
    .getElementById("docNotes")
    .value="";

  document
    .getElementById("docAdvice")
    .value=p.advice||"";

  document
    .getElementById("tamilPreviewText")
    .textContent=
      p.tamilAdvice||
      "Enter advice to generate the Tamil version.";

  renderDoctorAudit(p);

  addLog(
    "Patient record accessed",
    `${currentDoctor?.doctorId||"Doctor"} accessed ${p.patientId}.`,
    p.patientId
  );
}

function renderDoctorRead(p){

  document
    .getElementById("doctorRecordRead")
    .innerHTML=[

      ["Date of birth",p.dob],
      ["Blood group",p.blood],
      ["Medical history",p.history||"None recorded"],
      ["Allergies",p.allergies||"None recorded"],
      ["Medications",p.medications||"None recorded"],
      ["Conditions",p.conditions||"None recorded"],
      ["Emergency contact",p.emergency||"Not provided"],
      [
        "Additional emergency number",
        p.emergencyNumber||"Not provided"
      ]

    ]
    .map(
      ([k,v])=>
        `<div class="recordRow">
          <b>${esc(k)}</b>
          <br>
          ${esc(v)}
        </div>`
    )
    .join("");
}


/* =========================
   TAMIL ADVICE
========================= */

function tamilizeAdvice(text){

  const t=text.trim();

  if(!t)return "";

  let out=t

    .replace(
      /Take the prescribed medicine after food twice daily\.?/i,
      "பரிந்துரைக்கப்பட்ட மருந்தை உணவுக்குப் பிறகு தினமும் இரண்டு முறை எடுத்துக்கொள்ளுங்கள்."
    )

    .replace(
      /Drink sufficient water\.?/i,
      "போதுமான அளவு தண்ணீர் குடிக்கவும்."
    )

    .replace(
      /return for review after 7 days\.?/i,
      "7 நாட்களுக்குப் பிறகு மீண்டும் பரிசோதனைக்கு வாருங்கள்."
    );

  if(out===t){

    const lower=t.toLowerCase();

    if(
      lower.includes("after food") &&
      lower.includes("twice daily")
    )
      out=
        "மருந்தை உணவுக்குப் பிறகு தினமும் இரண்டு முறை எடுத்துக்கொள்ளுங்கள்.";

    else if(lower.includes("water"))
      out=
        "போதுமான அளவு தண்ணீர் குடிக்கவும்.";

    else if(lower.includes("7 days"))
      out=
        "7 நாட்களுக்குப் பிறகு மீண்டும் பரிசோதனைக்கு வாருங்கள்.";

    else
      out=
        "மருத்துவரின் ஆலோசனை: "+t;
  }

  return out;
}

document
  .getElementById("docAdvice")
  .addEventListener(
    "input",
    e=>{
      document
        .getElementById("tamilPreviewText")
        .textContent=
          tamilizeAdvice(e.target.value)||
          "Enter advice to generate the Tamil version.";
    }
  );


/* =========================
   DOCTOR UPDATE
========================= */

document
  .getElementById("doctorUpdateForm")
  .addEventListener(
    "submit",
    e=>{

      e.preventDefault();

      const p=getPatient();

      const old={
        conditions:p.conditions,
        allergies:p.allergies,
        medications:p.medications,
        advice:p.advice
      };

      const next={

        conditions:
          document
            .getElementById("docConditions")
            .value.trim(),

        allergies:
          document
            .getElementById("docAllergies")
            .value.trim(),

        medications:
          document
            .getElementById("docMedications")
            .value.trim(),

        advice:
          document
            .getElementById("docAdvice")
            .value.trim(),

        tamilAdvice:
          tamilizeAdvice(
            document
              .getElementById("docAdvice")
              .value
          ),

        notes:
          document
            .getElementById("docNotes")
            .value.trim()
      };

      const now=
        new Date().toLocaleString(
          "en-IN",
          {
            dateStyle:"medium",
            timeStyle:"short"
          }
        );

      const updates=p.updates||[];

      const changed=[];

      if(old.medications!==next.medications)
        changed.push("medication");

      if(old.allergies!==next.allergies)
        changed.push("allergies");

      if(old.conditions!==next.conditions)
        changed.push("conditions");

      if(old.advice!==next.advice)
        changed.push("doctor advice");

      const detail=
        changed.length
          ?changed.map(
              x=>`updated ${x}`
            ).join(", ")
          :"added consultation notes";

      updates.push({

        title:
          `Dr. ${currentDoctor?.doctorId||"Kumar"} ${detail}`,

        time:now,

        details:
          next.notes||
          "Clinical information updated."
      });

      Object.assign(
        p,
        next,
        {updates}
      );

      setPatient(p);

      addLog(
        "Clinical update",
        `Dr. ${currentDoctor?.doctorId||"Kumar"} ${detail}.`,
        p.patientId
      );

      renderDoctorRead(p);
      renderDoctorAudit(p);

      alert(
        "Clinical information saved."
      );
    }
  );

function renderDoctorAudit(p){

  const logs=
    getLogs()
      .filter(
        x=>x.patientId===p.patientId
      );

  document
    .getElementById("doctorAudit")
    .innerHTML=
      logs
        .slice(0,20)
        .map(
          l=>
            `<div class="recordRow">
              <b>${esc(l.type)}</b>
              —
              ${esc(l.details)}
              <br>
              <small>${esc(l.time)}</small>
            </div>`
        )
        .join("")
      ||
      "No activity yet.";
}


/* =========================
   CAMERA
========================= */

async function startCamera(){

  if(!window.Html5Qrcode)
    return alert(
      "QR scanner library did not load. Check internet connection."
    );

  if(qrScanner)return;

  qrScanner=
    new Html5Qrcode("reader");

  try{

    await qrScanner.start(
      {facingMode:"environment"},
      {
        fps:10,
        qrbox:{
          width:250,
          height:250
        }
      },
      handleScan,
      ()=>{}
    );

    document
      .getElementById("startCamera")
      .disabled=true;

    document
      .getElementById("stopCamera")
      .disabled=false;

    document
      .getElementById("scannerStatus")
      .textContent=
        "Camera active — point it at a MediTag QR.";

  }catch(err){

    qrScanner=null;

    document
      .getElementById("scannerStatus")
      .textContent=
        "Camera could not start. Use Upload QR Image.";
  }
}

async function stopCamera(){

  if(!qrScanner)return;

  try{
    await qrScanner.stop();
    await qrScanner.clear();
  }catch(e){}

  qrScanner=null;

  const a=
    document.getElementById("startCamera");

  const b=
    document.getElementById("stopCamera");

  if(a){
    a.disabled=false;
    b.disabled=true;
  }
}

document
  .getElementById("startCamera")
  .onclick=startCamera;

document
  .getElementById("stopCamera")
  .onclick=stopCamera;

document
  .getElementById("qrFile")
  .addEventListener(
    "change",
    async e=>{

      const file=e.target.files[0];

      if(!file)return;

      if(!window.Html5Qrcode)
        return alert(
          "QR scanner library did not load."
        );

      const temp=
        new Html5Qrcode("reader");

      document
        .getElementById("scannerStatus")
        .textContent=
          "Reading QR image…";

      try{

        handleScan(
          await temp.scanFile(
            file,
            true
          )
        );

      }catch(err){

        document
          .getElementById("scannerStatus")
          .textContent=
            "Could not read that QR image.";

      }finally{

        try{
          await temp.clear();
        }catch(e){}

        e.target.value="";
      }
    }
  );

function lookupManualToken(){

  handleScan(
    document
      .getElementById("manualToken")
      .value
  );
}


/* =========================
   NETWORK STATUS
========================= */

window.addEventListener(
  "online",
  ()=>{
    document
      .getElementById("network")
      .textContent="Online";
  }
);

window.addEventListener(
  "offline",
  ()=>{
    document
      .getElementById("network")
      .textContent="Offline";
  }
);

document
  .getElementById("network")
  .textContent=
    navigator.onLine
      ?"Online"
      :"Offline";


window.addEventListener(
  "beforeunload",
  ()=>{
    if(qrScanner)
      try{
        qrScanner.stop();
      }catch(e){}
  }
);


/* =========================
   BOOT
========================= */

(function boot(){

  const s=getSession();

  if(
    s?.role==="patient" &&
    s.patientId===getPatient().patientId
  ){

    renderPatientDashboard();
    showView("patientDashboard");

  }else if(s?.role==="doctor"){

    currentDoctor={
      doctorId:s.doctorId
    };

    document
      .getElementById("doctorWelcome")
      .textContent=s.doctorId;

    showView("doctorDashboard");

  }else{

    showView("landing");
  }

})();
