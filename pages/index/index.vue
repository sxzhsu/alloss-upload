<template>
	<view class="content width-height-100">
		<!-- 上传图片部分 -->
		<view class="image-content width-100">
			<view class="title text-36 text-bold flex justify-center">图片</view>
			<view class="width-100 flex justify-center relative">
			    <image class="image" :src="imageUrl" mode="scaleToFill"></image>
				<!-- 自定义进度条中间内容 -->
				<view class="cmd-progress absolute-50" v-if="imageProgress != 100 ">
					<view class="flex justify-center relative">
					  <cmd-progress type="circle" :percent="imageProgress" stroke-color="#FA6400" :stroke-width="8" :showInfo="false"></cmd-progress>
					  <view class="absolute-50">
						<view class="color-fa6400">{{imageProgress}}%</view>
					  </view>
					</view>
				</view>
				<!-- 直接使用进度条 -->
				<!-- <cmd-progress type="circle" :percent="progress" stroke-color="#FA6400" :stroke-width="8" :showInfo="false"></cmd-progress> -->
			</view>
			<view class="btn flex justify-center">
			    <button class="mini-btn" type="primary" size="mini" @click="uploadImage">上传图片</button>
			</view>
		</view>
		<view class="height-80"></view>
		<!-- 上传视频部分 -->
		<view class="video-content width-100">
			<view class="title text-36 text-bold flex justify-center">视频</view>
			<view class="width-100 flex justify-center relative">
			    <image class="image" :src="videoUrl" v-if="!videoUrl" mode="scaleToFill"></image>
				<video class="image" id="myVideo" :src="videoUrl" v-else></video>
				<!-- 自定义进度条中间内容 -->
				<view class="cmd-progress absolute-50" v-if="videoProgress != 100 ">
					<view class="flex justify-center relative">
					  <cmd-progress type="circle" :percent="videoProgress" stroke-color="#FA6400" :stroke-width="8" :showInfo="false"></cmd-progress>
					  <view class="absolute-50">
						<view class="color-fa6400 text-24">{{videoProgress}}%</view>
					  </view>
					</view>
				</view>
				<!-- 直接使用进度条 -->
				<!-- <cmd-progress type="circle" :percent="videoProgress" stroke-color="#FA6400" :stroke-width="8" :showInfo="false"></cmd-progress> -->
			</view>
			<view class="btn flex justify-center">
			    <button class="mini-btn" type="primary" size="mini" @click="uploadVideo">上传视频</button>
			</view>
		</view>
	</view>
</template>

<script>
	import OSSUtil from '@/commont/libs/ossUtil.js'
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"
	export default {
		components:{
			cmdProgress
		},
		data() {
			return {
				// 图片地址
				imageUrl:'',
				// 视频地址
				videoUrl:'',
				// 图片上传进度条
				imageProgress:0,
				// 视频上传进度条
				videoProgress:0
			}
		},
		onLoad() {

		},
		methods: {
            // 上传图片处理逻辑
		    async uploadImage(){
				const that = this
				
				let files = await OSSUtil.getImage(); // 选择图片
				let sign = await OSSUtil.get_STS() // 获取签名等信息
				let imageSrc = files.tempFilePaths[0]; // 图片上传微信平台返回的是数组
				let fileName = OSSUtil.getFileName('faxingVideo', imageSrc); // 第一个参数为自己设置的oss文件目录地址 第二个参数为文件目录地址
				
				console.log('image---',imageSrc)
				// uploadTask   此处返回所有上传信息，方便后面获取上传进度
				let uploadTask = uni.uploadFile({
					url: sign.host,
					filePath: imageSrc,
					fileType: 'image',
					name: 'file',
					formData: {
						name: imageSrc,
						'key': fileName,
						'policy': sign.policy,
						'OSSAccessKeyId': sign.accessId,
						'success_action_status': '200', //让服务端返回200,不然，默认会返回204
						'signature': sign.signature,
					},
					success: (res) => {
						if (res.statusCode != 200) {
							uni.showToast({
								title: '上传失败',
								icon: 'none',
								duration: 2000
							});
							return;
						 }
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 2000
						});
						that.imageUrl  = sign.host+"/"+fileName
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
				// 实时获取上传进度，图片文件太小，进度可能不是很明显
				uploadTask.onProgressUpdate((res) => {
					console.log("上传进度" + res.progress);
					this.imageProgress = res.progress;
				});
			},
			// 上传视频处理逻辑
			async uploadVideo(){
				const that = this
				
				let videoSrc = await OSSUtil.getVideo(); // 选择图片
				let sign = await OSSUtil.get_STS() // 获取签名等信息
				let fileName = OSSUtil.getVideoName('faxingVideo', videoSrc); // 第一个参数为自己设置的oss文件目录地址 第二个参数为文件目录地址
				
				// uploadTask   此处返回所有上传信息，方便后面获取上传进度
				let uploadTask = uni.uploadFile({
					url: sign.host,
					filePath: videoSrc,
					fileType: 'video',
					name: 'file',
					formData: {
						name: videoSrc,
						'key': fileName,
						'policy': sign.policy,
						'OSSAccessKeyId': sign.accessId,
						'success_action_status': '200', //让服务端返回200,不然，默认会返回204
						'signature': sign.signature,
					},
					success: (res) => {
						if (res.statusCode != 200) {
							uni.showToast({
								title: '上传失败',
								icon: 'none',
								duration: 2000
							});
							return;
						 }
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 2000
						});
						that.videoUrl  = sign.host+"/"+fileName
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
				uploadTask.onProgressUpdate((res) => {
					console.log("上传进度" + res.progress);
					this.videoProgress = res.progress;
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	// @import "@/commont/style/base";
	page{
		width: 100%;
		height: 100%;
	}
	.content {
		padding-top: 30rpx;
		.height-80{
			height: 80rpx;
		}
		.image-content{
			.image{
				width: 90%;
				border-radius: 10rpx;
				border: 1rpx #007AFF dashed;
			}
			.btn{
				margin-top: 10rpx;
				.mini-btn{
					width: 80%;
				}
			}
		}
		.video-content{
			.image{
				width: 90%;
				border-radius: 10rpx;
				border: 1rpx #007AFF dashed;
			}
			.btn{
				margin-top: 10rpx;
				.mini-btn{
					width: 80%;
				}
			}
		}
	}
	
	
	/* 公用样式部分 */
	.color-fa6400{
		color: #FA6400;
	}
	.text-36{
		font-size: 36rpx;
	}
	.text-bold{
		font-weight: bold;
	}
	.text-24{
		font-size: 24rpx;
	}
	/* 宽高相关 */
	.width-100{
		width: 100%;
	}
	.width-height-100{
		width: 100%;
		height: 100%;
	}
	
	/* 弹性盒子相关 */
	.flex{
		display: flex;
	}
	.align-center{
		align-items: center;
	}
	.justify-center{
		justify-content: center;
	}
	
	/* 定位相关 */
	.relative{
		position: relative;
	}
	
	.absolute-50{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
