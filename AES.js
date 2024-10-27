function encrypt() {
    const key = document.querySelector('.key').value;
    const mw = document.querySelector('.mw').value;
    //输出密钥和明文
    //document.getElementById('output').textContent = '密钥: ' + key + ', 明文: ' + mw;
    //密钥扩展
    let ex_key=key_expansion(key);
    //第0轮 执行按位异或操作并输出结果
    const pre_result = hexXOR(mw, key);
    document.getElementById('output').textContent = '异或结果: ' + pre_result;
    //第1轮 ns半字节替代
    const ns_result = NS(pre_result);
    //console.log(ns_result);
    document.getElementById('output2').textContent = '半字节代替变换结果: ' + ns_result;
    const sr_result = SR(ns_result);
    //console.log(sr_result);
    document.getElementById('output3').textContent = '行移位结果: ' + sr_result;
    const mc_result = MC(sr_result); //列混淆
    //console.log(sr_result);
    document.getElementById('output4').textContent = '列混淆结果: ' + mc_result;
    //第一轮最终：轮密相加
    const w23=ex_key.slice(0,16);
    console.log("w23: "+w23);
    const pre_result2 = hexXOR(hexToBin(mc_result), w23);
    document.getElementById('output5').textContent = '第二轮异或结果: ' + pre_result2;
    //第2轮 ns半字节替代
    const ns_result2 = NS(pre_result2);
    //console.log(ns_result);
    document.getElementById('output6').textContent = '第二轮半字节代替变换结果: ' + ns_result2;
    const sr_result2 = SR(ns_result2);
    //console.log(sr_result);
    document.getElementById('output7').textContent = '第二轮行移位结果: ' + sr_result2;
    //第一轮最终：轮密相加
    const w45=ex_key.slice(16,32);
    console.log("w45 "+w45);
    const ciphertext = hexToBin(hexXOR(hexToBin(sr_result2), w45));
    document.getElementById('output8').textContent = '密文: ' + ciphertext;
}
//密钥：0010110101010101
//明文：1010011101001001
function encrypt2(mw,key) {
    let ex_key=key_expansion(key);
    //第0轮 执行按位异或操作并输出结果
    const pre_result = hexXOR(mw, key);
    //document.getElementById('output').textContent = '异或结果: ' + pre_result;
    //第1轮 ns半字节替代
    const ns_result = NS(pre_result);
    //console.log(ns_result);
    //document.getElementById('output2').textContent = '半字节代替变换结果: ' + ns_result;
    const sr_result = SR(ns_result);
    //console.log(sr_result);
    //document.getElementById('output3').textContent = '行移位结果: ' + sr_result;
    const mc_result = MC(sr_result); //列混淆
    //console.log(sr_result);
    //document.getElementById('output4').textContent = '列混淆结果: ' + mc_result;
    //第一轮最终：轮密相加
    const w23=ex_key.slice(0,16);
    //console.log("w23: "+w23);
    const pre_result2 = hexXOR(hexToBin(mc_result), w23);
    //document.getElementById('output5').textContent = '第二轮异或结果: ' + pre_result2;
    //第2轮 ns半字节替代
    const ns_result2 = NS(pre_result2);
    //console.log(ns_result);
    //document.getElementById('output6').textContent = '第二轮半字节代替变换结果: ' + ns_result2;
    const sr_result2 = SR(ns_result2);
    //console.log(sr_result);
    //document.getElementById('output7').textContent = '第二轮行移位结果: ' + sr_result2;
    //第一轮最终：轮密相加
    const w45=ex_key.slice(16,32);
    //console.log("w45 "+w45);
    const ciphertext = hexToBin(hexXOR(hexToBin(sr_result2), w45));
    //document.getElementById('output8').textContent = '密文: ' + ciphertext;
    return ciphertext;
}
//第五关
// 生成随机的16位IV
function generateIv() {
    const iv = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
    console.log("iv "+iv);
    return iv;
}

// CBC模式加密
function cbcEncrypt() {
    const iv=generateIv();
    let ciphertext = '';
    let previousCipherText = hexToBin(iv).toString();
    document.getElementById('output').textContent = '初始向量: ' + previousCipherText;
    console.log("previousCipherText "+previousCipherText);
    const r=get();
    const key=r.slice(0,16);
    const plaintext=r.slice(16);
    //console.log("key "+key);
    //console.log("plaintext "+plaintext);
    for (let i = 0; i < plaintext.length; i += 16) {
        let block = plaintext.substring(i, i + 16);
        console.log("block屬性 "+typeof(block));
        console.log("block "+block);
        block = hexToBin(hexXOR(block, previousCipherText));
        console.log("block屬性2 "+typeof(block));
        let encryptedBlock = encrypt2(block,key); // 假设encrypt函数使用S-AES算法加密
        ciphertext += encryptedBlock;
        previousCipherText = encryptedBlock;
    }
    document.getElementById('output2').textContent = '最终密文: ' + ciphertext;
    const tamperedCiphertext = tamperCiphertext(ciphertext, 1, '00001111000011111111000011110000');
    const tamperedPlaintext = cbcDecrypt(tamperedCiphertext, key, iv);
    document.getElementById('output3').textContent = '替换后解密结果: ' + ciphertext;
}
function cbcDecrypt(ciphertext, key, iv) {
    let plaintext = '';
    let previousCipherText = hexToBin(iv).toString();
    const blocks = ciphertext.match(/.{1,16}/g); // 将密文分成16位的块

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        block = Decrypt(block, key); // S-AES解密
        block = xor(block, previousCipherText); // 异或操作
        plaintext += block;
        previousCipherText = blocks[i]; // 使用当前密文块作为下一个块的前一个密文块
    }
    return plaintext;
}
function Decrypt(){
    const ciphertext=encrypt
}
// CBC模式解密
//获取前端数据
function get(){
    const key = document.querySelector('.key').value;
    const mw = document.querySelector('.mw').value;
    return key+mw;
}

// 篡改密文分组
function tamperCiphertext(ciphertext, index, newBlock) {
    const blocks = ciphertext.match(/.{1,32}/g); // 将密文分成32位的块
    blocks[index] = newBlock; // 替换指定的密文块
    return blocks.join('');
}
function stringToAsciiString(inputString) {
    let asciiString = '';
    for (let i = 0; i < inputString.length; i++) {
        asciiString += inputString.charCodeAt(i).toString();
    }
    return asciiString;
}
function asciiStringToString(asciiString) {
    let resultString = '';
    for (let i = 0; i < asciiString.length; i += 2) {
        const asciiValue = parseInt(asciiString.substr(i, 2), 10);
        resultString += String.fromCharCode(asciiValue);
    }
    return resultString;
}
//第三关扩展
function expansion() {
    const key = document.querySelector('.key').value;
    let plaintext = document.querySelector('.mw').value;
    plaintext=stringToAsciiString(plaintext);
    let ex_key=key_expansion(key);
    const w23=ex_key.slice(0,16);
    const w45=ex_key.slice(16,32);
    let ciphertext="";
    for (let i = 0; i < plaintext.length; i += 16) 
        {
        let block = plaintext.substring(i, i + 16);
        
        const pre_result = hexXOR(plaintext, key);
    //第1轮 ns半字节替代
    const ns_result = NS(pre_result);
    const sr_result = SR(ns_result);
    const mc_result = MC(sr_result); //列混淆
    //第一轮最终：轮密相加
    const w23=ex_key.slice(0,16);
    const pre_result2 = hexXOR(hexToBin(mc_result), w23);
    //第2轮 ns半字节替代
    const ns_result2 = NS(pre_result2);
    const sr_result2 = SR(ns_result2);
    //第一轮最终：轮密相加
    const w45=ex_key.slice(16,32);
    encryptedBlock = hexToBin(hexXOR(hexToBin(sr_result2), w45));
        ciphertext += encryptedBlock;
        previousCipherText = encryptedBlock;
    }
    document.getElementById('output').textContent = '密文: ' + ciphertext;
    ciphertext=asciiStringToString(ciphertext);
    document.getElementById('output2').textContent = '转换为字符串密文: ' + ciphertext;
}
//密钥扩展 密钥格式及样例 0010110101010101
function key_expansion(key) {
    const w0 = key.slice(0, 8);
    const w1 = key.slice(8, 16);
    let arr = w1.split("");
    //console.log(arr);
    //RotNib
    let swappedkey = arr[4] + arr[5] + arr[6] + arr[7] + arr[0] + arr[1] + arr[2] + arr[3];
    // 将交换后的16进制数转换为二进制number类型
    //   console.log("密钥交换检查结果："+swappedkey);
    //SubNib 使用s盒（参数不同，直接重新写函数）
    const s_box = ['9', '4', 'A', 'B', 'D', '1', '8', '5', '6', '2', '0', '3', 'C', 'E', 'F', '7'];
    let tmp1 = swappedkey.slice(0, 4);
    let index1 = parseInt(tmp1, 2);
    //console.log("index1:" + index1);
    let tmp2 = swappedkey.slice(4, 8);
    let index2 = parseInt(tmp2, 2);
    //console.log("index2:" + index2);
    let ex_result = hexToBin(s_box[index1] + s_box[index2]);
    console.log("SubNib后初始结果："+ex_result);
    let tmp = hexToBin(hexXOR(w0, '10000000'));
    console.log("hexXOR结果并转换为2进制："+tmp);
    const w2 = hexToBin(hexXOR(tmp, ex_result));
    //const w2 = tmp.padStart(8, '0'); // 确保w2是8位二进制数
    console.log("w2:" + w2);
    const w3 = hexToBin(hexXOR(w2, w1));
    console.log("w3" + w3);
    let arr2 = w3.split("");
    //console.log(arr2);
    let swappedkey2 = arr2[4] + arr2[5] + arr2[6] + arr2[7] + arr2[0] + arr2[1] + arr2[2] + arr2[3];
    // 将交换后的16进制数转换为二进制number类型
    //console.log("w3密钥交换检查结果："+swappedkey2);10011110
    let tmp21 = swappedkey2.slice(0, 4);
    let index21 = parseInt(tmp21, 2);
    //console.log("index21:"+index21);9
    let tmp22 = swappedkey2.slice(4, 8);
    let index22 = parseInt(tmp22, 2);
    //console.log("index22:"+index22);//5有问题
    let ex_result2 = hexToBin(s_box[index21] + s_box[index22]);
    //console.log(ex_result2);
    //得到g(w3)与w3异或求解得w4
    let w4 = hexToBin(hexXOR(w2, '00110000'));
    w4 = hexToBin(hexXOR(w4, ex_result2));
    const w5 = hexToBin(hexXOR(w4, w3));
    //console.log("w45"+w4+w5);
    //返回值为扩展密钥 w2345
    const final_result = w2 + w3 + w4 + w5;
    return final_result;
}
function hexToBin(hexStr) {
    // 创建一个映射表，将十六进制字符映射到相应的四位二进制字符串
    const hexToBinMap = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
        'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111'
    };

    // 将十六进制字符串转换为二进制字符串
    let binStr = '';
    for (let i = 0; i < hexStr.length; i++) {
        binStr += hexToBinMap[hexStr[i].toLowerCase()];
    }

    return binStr;
}

// 列混淆
function MC(str) {
    let arr = str.split("");
    arr = arr.map(function (char) {
        return parseInt(char, 16);
    });
    const numarray = arr.map(Number);
    //console.log(numarray); 6,12,4,0
    let result = "";
    const multiply_table = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [0, 2, 4, 6, 8, 10, 12, 14, 3, 1, 7, 5, 11, 9, 15, 13],
        [0, 3, 6, 5, 12, 15, 10, 9, 11, 8, 13, 14, 7, 4, 1, 2],
        [0, 4, 8, 12, 3, 7, 11, 15, 6, 2, 14, 10, 5, 1, 13, 9],
        [0, 5, 10, 15, 7, 2, 13, 8, 14, 11, 4, 1, 9, 12, 3, 6],
        [0, 6, 12, 10, 11, 13, 7, 1, 5, 3, 9, 15, 14, 8, 2, 4],
        [0, 7, 14, 9, 15, 8, 1, 6, 13, 10, 3, 4, 2, 5, 12, 11],
        [0, 8, 3, 11, 6, 14, 5, 13, 12, 4, 15, 7, 10, 2, 9, 1],
        [0, 9, 1, 8, 2, 11, 3, 10, 4, 13, 5, 12, 6, 15, 7, 14],
        [0, 10, 7, 13, 14, 4, 9, 3, 15, 5, 8, 2, 1, 11, 6, 12],
        [0, 11, 5, 14, 10, 1, 15, 4, 7, 12, 2, 9, 13, 6, 8, 3],
        [0, 12, 11, 7, 5, 9, 15, 2, 10, 6, 1, 13, 14, 3, 4, 8],
        [0, 13, 9, 4, 1, 12, 8, 5, 2, 15, 11, 6, 3, 14, 10, 7],
        [0, 14, 15, 1, 13, 3, 2, 12, 9, 7, 6, 8, 4, 10, 11, 5],
        [0, 15, 13, 2, 9, 6, 4, 11, 1, 14, 10, 3, 8, 7, 5, 12]
    ];

    let add_table = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14],
        [2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13],
        [3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8, 15, 14, 13, 12],
        [4, 5, 6, 7, 0, 1, 2, 3, 12, 13, 14, 15, 8, 9, 10, 11],
        [5, 4, 7, 6, 1, 0, 3, 2, 13, 12, 15, 14, 9, 8, 11, 10],
        [6, 7, 4, 5, 2, 3, 0, 1, 14, 15, 12, 13, 10, 11, 8, 9],
        [7, 6, 5, 4, 3, 2, 1, 0, 15, 14, 13, 12, 11, 10, 9, 8],
        [8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7],
        [9, 8, 11, 10, 13, 12, 15, 14, 1, 0, 3, 2, 5, 4, 7, 6],
        [10, 11, 8, 9, 14, 15, 12, 13, 2, 3, 0, 1, 6, 7, 4, 5],
        [11, 10, 9, 8, 15, 14, 13, 12, 3, 2, 1, 0, 7, 6, 5, 4],
        [12, 13, 14, 15, 8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3],
        [13, 12, 15, 14, 9, 8, 11, 10, 5, 4, 7, 6, 1, 0, 3, 2],
        [14, 15, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5, 2, 3, 0, 1],
        [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    //1010011101001001
    //0010110101010101   
    let r1 = (add_table[numarray[0]][multiply_table[4][numarray[1]]]);
    //console.log("测试点一："+multiply_table[4][numarray[1]]); //number 5 没问题
    //console.log(add_table[numarray[0]][multiply_table[4][numarray[1]]]); 核对没问题0
    //console.log(add_table[5][6]);
    //console.log(r1);

    r1 = r1.toString(16);
    result += r1;
    let r2 = (add_table[numarray[1]][multiply_table[4][numarray[0]]]);
    //console.log(multiply_table[4][numarray[0]]);
    console.log(r2);
    if (typeof (r2) === 'number') {
        r2 = r2.toString(16);
    }
    result += r2;
    let r3 = (add_table[numarray[2]][multiply_table[4][numarray[3]]]).toString(16);
    let r4 = (add_table[numarray[3]][multiply_table[4][numarray[2]]]).toString(16);
    r3 = r3.toString(16);
    r4 = r4.toString(16);
    result += r3;
    result += r4;
    //console.log(result);
    return result;
}
//半字节替代 输入为08f7
//1111111111111111
//0101010101010101
function NS(str) {
    const s_box = ['9', '4', 'A', 'B', 'D', '1', '8', '5', '6', '2', '0', '3', 'C', 'E', 'F', '7'];
    //将十六进制字符串转换为二进制
    var binaryString = hexToBin(str);
    console.log("NS传入参数检验是否为2进制："+str);
    let result = "";
    for (i = 0; i < 4; i++) {
        let substri = binaryString.slice(i * 4, i * 4 + 4);
        //let substrj=binaryString.slice(i*4+2,i*4+4);
        let index = parseInt(substri, 2);
        result += s_box[index];
    }
    //console.log(s_box[0]);
    return result;
}
//行移位
function SR(str) {
    const arr = str.split("");
    //console.log(arr);
    let result = arr[0];
    result += arr[3];
    result += arr[2];
    result += arr[1];
    return result;
}
//接受输入为2进制字符串
function hexXOR(str1, str2) {
    const len=str1.length;
    const arr1=str1.split("");
    const arr2=str2.split("");
    let xorResult="";
    for(let i=0;i<len;i++){
        if(arr1[i]==arr2[i])
            xorResult+="0";
        else xorResult+="1";
    }
    xorResult=binaryToHex(xorResult);
    return xorResult;
}
function binaryToHex(binaryStr) {
    // 确保二进制字符串长度是4的倍数
    // if (binaryStr.length % 4 !== 0) {
    //     throw new Error('Binary string length must be a multiple of 4.');
    // }

    // 将二进制字符串每4位一组进行分割
    const binaryGroups = binaryStr.match(/.{1,4}/g);

    // 将每组二进制位转换为对应的十六进制数字
    const hexStr = binaryGroups.map(group => parseInt(group, 2).toString(16)).join('');

    return hexStr;
}
