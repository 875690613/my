// 导入CryptoJS
import CryptoJS from 'crypto-js'

const IV_SIZE = 16; // 以字节为单位
const KEY_SIZE = 128; // 位

// 导出一个函数，使用AES算法加密文本
export function encrypt(plainText, secretKey) {
    const str = CryptoJS.enc.Utf8.parse(plainText);
    // 生成随机初始化向量
    const iv = CryptoJS.lib.WordArray.random(IV_SIZE);

    // 将密钥转换为字节数组
    const keyBytes = CryptoJS.enc.Utf8.parse(secretKey.substring(0, Math.min(secretKey.length, KEY_SIZE / 8)));

    // 初始化AES加密器
    const encrypted = CryptoJS.AES.encrypt(str, keyBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // 获取加密后的数据和IV
    const encryptedBytes = encrypted.ciphertext;
    const ivBytes = iv;

    // 合并IV和加密后的文本
    const combined = ivBytes.concat(encryptedBytes);

    // 返回Base64编码的结果
    return CryptoJS.enc.Base64.stringify(combined);
}