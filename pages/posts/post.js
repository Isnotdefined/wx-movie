var postsData = require('../../data/posts-data.js')
Page({
    data: {
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载 
        //this.data.post_key=postsData.postlist;    不能用了
        this.setData({
            post_key: postsData.postlist
        });
    },
    onposttap:function(event){
        var postId=event.currentTarget.dataset.postid;
        wx.navigateTo({
             url: "post-detail/post-detail?id="+postId
        })
    },
    // onSwiperItemTap:function(event){
    //     var postId=event.currentTarget.dataset.postid;
    //     wx.navigateTo({
    //          url: "post-detail/post-detail?id="+postId
    //     })
    // },
    onSwiperTap:function(event){
    //target:image  currentTarget:swiper
             var postId=event.target.dataset.postid;
          wx.navigateTo({
             url: "post-detail/post-detail?id="+postId
        })

    }
})