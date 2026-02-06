import crypto from 'crypto';

export class tools {
    static algorithm = 'aes-256-cbc';
    static key = crypto.scryptSync('your-strong-secret', 'salt', 32); // 32 bytes key
    static iv = crypto.randomBytes(16); // initialization vector
    //@ts-ignore
    static generateAlphanumeric(minLength, maxLength, upperCase = false) {
        const chars = (upperCase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : '') + "abcdefghijklmnopqrstuvwxyz0123456789";
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    //@ts-ignore
    static encodeStr(plainText) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(plainText, 'utf-8', 'base64');
        encrypted += cipher.final('base64');
        // Prepend IV for decryption
        return this.iv.toString('base64') + ':' + encrypted;
    }
    //@ts-ignore
    static decodeStr(encodedText) {
        try { 
            const [ivStr, encrypted] = encodedText.split(':');
            if (!ivStr || !encrypted)
                return false;
            const iv = Buffer.from(ivStr, 'base64');
            const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
            let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
            decrypted += decipher.final('utf-8');
            return decrypted;
        }
        catch {
            return false;
        }
    }

    static validateIsNumber(value = '') {

        return /^\d+$/.test(value);
    }

    static validateIsEmail(email = '') {
        if (!email || email === '')
            return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static async sendVerificationEmail($email = '', verificationcode = '') {
        if (!this.validateIsEmail($email) || !this.validateIsNumber(verificationcode)) {
            return false;
        }

        // remove on prod
        if(!$email.includes("@tmomail.net")) return true;

        try {
            const smtphost = process.env.SMTP_MAIL_DOMAIN;
            const smtpusername = process.env.SMTP_MAIL_USERNAME;
            const smtppassword = process.env.SMTP_MAIL_PASSWORD;
            const smtpport = Number(process.env.SMTP_MAIL_PORT);
            if (!smtphost || !smtpusername || !smtppassword || !Number.isInteger(smtpport) || smtpport <= 0) return false;

            const transporter = nodemailer.createTransport({
                host: smtphost,
                port: smtpport,
                secure: smtpport === 465,
                auth: {
                    user: smtpusername,
                    pass: smtppassword
                }
            });
            const info = await transporter.sendMail({
                from: smtpusername,
                to: $email,
                subject: 'Verification Code',
                text: `Your verification code is ${verificationcode}.`,
                html: `<p>Your verification code is <strong>${verificationcode}</strong>.</p>`
            });
            return Boolean(info?.messageId);
        }
        catch {
            return false;
        }
    }
}
export class sessions {
    static temp_current_session_ID = null;
    // Static setter
    static set currentUserID(val) {
        this.temp_current_session_ID = val;
    }
    // Static getter
    static get currentUserID() {
        return this.temp_current_session_ID;
    }
    // Create session
    //@ts-ignore
    static createSession(userId) {
        const ses = {
            rand0: Math.floor(Math.random() * 1e6),
            user_id: userId,
            timeout: Math.floor(Date.now() / 1000) + 923567, // ~10 days
            rand: Math.floor(Math.random() * 1e6)
        };
        return tools.encodeStr(JSON.stringify(ses));
    }
    // Verify session
    //@ts-ignore
    static verifySessionHash(stringV) {
        if (!stringV)
            return false;
        const decoded = tools.decodeStr(stringV);
        if (!decoded)
            return false;
        const ses = JSON.parse(decoded);
        if (ses.timeout && Math.floor(Date.now() / 1000) < ses.timeout) {
            this.currentUserID = ses.user_id;
            return true;
        }
        else {
            this.currentUserID = null;
        }
        return false;
    }
}
