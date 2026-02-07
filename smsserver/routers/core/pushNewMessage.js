import db_pool from "../../global/database.js";
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'

export default async function pushNewMessage(
    phoneNumberInput,
    country,
    shortcountry,
    countryphonecode,
    message
) {
    const response = { code: 404, message: "no message sent." }

    try {
        const safeMessage = String(message ?? "").trim()
        if (!safeMessage) {
            response.code = 201
            response.message = "Input text message empty."
            return response
        }

        // Clean and validate input
        if (!phoneNumberInput || typeof phoneNumberInput !== 'string') {
            response.code = 201
            response.message = "Invalid phone number format."
            return response
        }

        // Remove any whitespace and normalize
        const cleanedPhone = phoneNumberInput.trim().replace(/\s+/g, '')

        // Parse the phone number
        const parsed = parsePhoneNumberFromString(cleanedPhone, 'US')

        // ---------- Validation ----------
        if (!parsed || !parsed.isValid()) {
            response.code = 201
            response.message = "Invalid phone number."
            return response
        }

        if (parsed.countryCallingCode !== "1") {
            response.code = 201
            response.message = "Only +1 (US/Canada) numbers allowed."
            return response
        }

        // Additional validation for North American numbering plan
        const nationalNumber = parsed.nationalNumber
        const areaCode = nationalNumber.substring(0, 3)
        
        // Validate area code exists (basic check)
        if (areaCode.length !== 3 || !/^[2-9][0-9]{2}$/.test(areaCode)) {
            response.code = 201
            response.message = "Invalid area code."
            return response
        }

        // Validate full national number length
        if (nationalNumber.length !== 10) {
            response.code = 201
            response.message = "Phone number must be 10 digits (excluding country code)."
            return response
        }

        // Optional: Validate it's a possible number (not just valid format)
        const isValidNumber = parsed.isPossible()
        if (!isValidNumber) {
            response.code = 201
            response.message = "Not a possible phone number."
            return response
        }

        // Optional: Check if it's a mobile number (if you need mobile only)
        // const numberType = parsed.getType()
        // if (numberType !== 'MOBILE' && numberType !== 'FIXED_LINE_OR_MOBILE') {
        //     response.code = 201
        //     response.message = "Only mobile numbers allowed."
        //     return response
        // }

        // ---------- Insert ----------
        const sql = `
            INSERT INTO textmessages
            (phonenumber, country, shortcountry, countryphonecode, message)
            VALUES ($1, $2, $3, $4, $5)
        `

        await db_pool.query(sql, [
            nationalNumber,  // e.g., "2345556789" (no country code)
            country,
            shortcountry,
            parsed.countryCallingCode,  // "1"
            safeMessage
        ])

        response.code = 200
        response.message = "Message pushed successfully."

    } catch (err) {
        console.error(err)
        response.code = 500
        response.message = err.message || "Unknown error"
    }

    return response
}