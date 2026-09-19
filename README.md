# MediTag v3

Updated hackathon prototype implementing the requested MediTag v3 flow.

## Main flow

### Landing page
- Patient Login
- Doctor Login
- New Patient Registration

### New Patient Registration
Fields:
- Name
- DOB
- Blood group
- Phone
- Emergency contact
- Medical conditions
- Allergies
- Current medications
- Medical history

After registration:
> Your MediTag profile has been created.

The patient dashboard intentionally has **no Edit button** for medical information.

### Patient Login
- Phone / Patient ID
- Patient OTP: `111222`

Patient can:
- View complete profile
- View QR
- Download/print QR
- View who accessed the record
- View doctor-updated information
- Listen to the care summary in Tamil

### Doctor Login
- Doctor ID
- Doctor password/verification: `MEDI123`
- Doctor OTP: `333444`

Doctor dashboard:
- Scan MediTag QR
- Find patient by token
- View history, allergies, medications and conditions
- Update clinical information
- Add consultation notes
- Update medications/allergies/conditions
- Save changes
- Audit entries with timestamp

### QR
QR contains:
`MEDI-TAG:<patient-token>`

It does **not** contain medical information.

### Tamil
English + Tamil are intentionally used for the hackathon. The doctor advice is stored with a Tamil care-summary field, and the patient can press **Listen in Tamil** using browser speech synthesis (`ta-IN`).

## Demo data
The app has a synthetic demo patient:
- Patient ID: `MT-1001`
- Name: Ananya Rao
- Token: `demo-ananya-1001`

If the browser has no registered patient yet, this demo patient is used automatically.

## Run
Open the folder in VS Code and use Live Server, or:

```bash
python -m http.server 5500
```

Then open:
`http://localhost:5500`

QR camera scanning and browser speech may require HTTPS/localhost and browser permissions.

## Prototype limitation
This remains a frontend/localStorage hackathon prototype. Authentication, database persistence, encryption, secure OTP delivery, verified doctor identity, and production-grade access control must be implemented on a secure backend before real patient data is used.
