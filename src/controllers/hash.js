import crypto from "node:crypto";

function hashSha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

export { hashSha256 };