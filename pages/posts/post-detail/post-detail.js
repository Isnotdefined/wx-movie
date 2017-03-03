var postsData = require('../../../data/posts-data.js');
var app=getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var globalData=app.globalData;
        var postId = option.id;
        var postData = postsData.postlist[postId];
        this.setData({
            currentPostId: postId,
            postData: postData
        });
        var postsCollected = wx.getStorageSync('posts_collected');

        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};   //没有缓存就起一个，以免后面设置属性报错
            //postsCollected[postId]=false;
            wx.setStorageSync('posts_collected', postsCollected)
        }
        if(globalData.g_isPlayingMusic&& app.globalData.g_currentMusicPostId===postId){
            this.setData({
                isPlayingMusic:true
            })
        }
        this.setAudioMonitor();
       
    },
    setAudioMonitor:function(){
        var that=this;
         wx.onBackgroundAudioPlay(function(){
            that.setData({
                isPlayingMusic:true
            })
            app.globalData.g_isPlayingMusic=true;
            app.globalData.g_currentMusicPostId=that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function(){
            that.setData({
                isPlayingMusic:false
            })
            app.globalData.g_isPlayingMusic=false;
            app.globalData.g_currentMusicPostId=null;
        });
    },
    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);

    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏文章" : "取消收藏",
            showCancel: "true",
            cancelText: "取消",
            confirmText: "确定",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        var that = this;
        wx.setStorageSync('posts_collected', postsCollected);
        that.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "收藏取消"
        })
    },
    onShareTap: function () {
        var itemList = [
            "分享到微信",
            "分享到微博",
            "分享到QQ",
            "分享到朋友圈"
        ]
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                //res.cancel 用户是否点击了取消
                //res.tapIndex 用户点击的数组序号
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消" + res.cancel + "现在无法实现分享功能"
                })
            }
        })
    },
    onMusicTap: function (event) {
        var currentPostId=this.data.currentPostId;
        var postData = postsData.postlist[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic:false
            })
        } else {
            wx.playBackgroundAudio({               
                dataUrl: postData.music.url,
                title:postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic:true
            })
        }
    }

})


