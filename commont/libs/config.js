var fileHost = "" // oss基础地址，自己设置  如：'https：//baidu.com'
var config = {
    //aliyun OSS config
    uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
    AccessKeySecret: '', // OSS中accessKeySecret
    OSSAccessKeyId: '',   // OSS中accessKeyId
    timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config