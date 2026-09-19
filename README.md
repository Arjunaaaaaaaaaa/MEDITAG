# MediTag

## Digital Emergency Health Record & Medical Identity System

MediTag is a digital health-record prototype designed to make essential patient medical information easier to access during emergencies.

The system uses a unique MediTag identifier and QR code to connect a patient with their digital medical record. The QR code itself does not contain medical information. It contains only the patient's MediTag token.

The project focuses on improving emergency access to important information such as blood group, allergies, medical conditions, medications, medical history, and doctor advice.

---

## 1. Problem Statement

Medical information is often scattered across hospitals, clinics, paper records, and different healthcare providers.

During an emergency, important information may not be immediately available to the treating team. This can create difficulties such as:

- Missing allergy information
- Unknown medications
- Incomplete medical history
- Difficulty identifying the patient
- Delays in accessing previous records
- Patients being unable to clearly communicate their medical history
- Lack of a simple mechanism for sharing essential emergency information

MediTag aims to provide a centralized digital record prototype that can be accessed through a patient-specific identifier and QR code.

---

## 2. Proposed Solution

MediTag provides a digital medical identity for each patient.

A patient can have:

- A unique MediTag ID
- A unique QR/token
- Personal information
- Blood group
- Medical conditions
- Allergies
- Current medications
- Medical history
- Emergency contact information
- Doctor advice
- Tamil patient-care summary
- Access history
- Update history

The QR code acts as a pointer to the patient's MediTag identity rather than storing medical information directly.

---

## 3. Key Features

### Patient Registration

Patients can create a MediTag profile containing information such as:

- Name
- Date of birth
- Blood group
- Phone number
- Email
- Emergency contact
- Medical conditions
- Allergies
- Medications
- Medical history

---

### Patient Login

The patient can log in using their MediTag ID.

The current prototype includes a demonstration login flow.

After login, the patient can view their medical profile and other MediTag information.

---

### Digital Medical Profile

The patient dashboard displays important information including:

- Personal information
- Blood group
- Medical conditions
- Allergies
- Medications
- Medical history
- Doctor advice
- Emergency contact

This provides a single view of important medical information.

---

### QR Code Generation

Each patient has a MediTag token.

Example:

```text
MEDI-TAG:demo-ananya-1001
