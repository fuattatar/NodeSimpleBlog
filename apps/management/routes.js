var routes = function (app) {
    var mongoose = require('mongoose');
    var Post = mongoose.model('Post');
    var Comment = mongoose.model('Comment');
    var Category = mongoose.model('Category');
    var PostCategory = mongoose.model('PostCategory');
    var FriendlySite=mongoose.model('FriendlySite');
    var moment = require('moment');
    var urlify = require('urlify').create({
        addEToUmlauts: true,
        szToSs: true,
        spaces: "-",
        nonPrintable: "-",
        trim: true
    });

    
    
    ////Error nesnesini null tanımlıyoruz
    app.locals.error = null;
    /*GET*/
    app.get('/Management',function (req, res) {
        return res.render(__dirname + "/views/index", {
            title: 'Yönetim Paneli',
            stylesheet: 'managementindex'
        });
    });

    app.get('/Management/Exit', function (req, res) {
        if (req.session.email) delete req.session.email

        res.redirect('/');
    });

    app.get('/Management/Post/New', function (req, res) {
        Category.find({}, function (err, categories) {
            if (!categories.length) {
                console.log('Kategori bulunamadı');
            }

            return res.render(__dirname + "/views/createpost", {
                title : 'Yeni Gönderi Oluştur',
                stylesheet : 'postcreate',
                categories : categories
            });   
        });
    });
   
    app.get('/Management/Category/New', function (req, res) {
        return res.render(__dirname + "/views/categorycreate", {
            title: 'Yeni Kategori Oluştur',
            stylesheet: 'categorycreate'
        });
    });

    app.get('/Management/Post/Index',function (req, res) {
        Post.find({}, function (err, docs) {
            if (!docs.length) {
                console.log('Gönderi bulunamadı');
            }
            console.log(docs);

            return res.render(__dirname + "/views/postindex", {
                title: 'Gönderi Listesi',
                stylesheet: 'postindex',
                posts: docs
            });
        });
    });

    /*Comments Get*/
    app.get('/Management/Comment/Index', function (req, res) {
        Comment.find({}, function (err, comments) {
            if (!comments.length) {
                console.log('Yorum bulunamadı');
            }
            console.log(comments);

            return res.render(__dirname + "/views/commentindex", {
                title: 'Gönderi Listesi',
                stylesheet: 'commentindex',
                comments: comments
            });
        });
    });

    app.get('/Management/Post/Edit/:id', function (req, res) {
        Post.findOne({
            _id: req.params.id
        }, function (err, post) {
            console.log(post);
            if (err) return next(err);
            
            Category.find({},function(err,categories){
                console.log("Kategorilerrrrr"+categories);
                if(err) return next(err);
                
                console.log("postid eşittir="+post._id);
                PostCategory.find({postid:req.params.id},function(err,postcategories){
                    if(err) return next(err);
                
                    console.log("post kategiroileriii="+postcategories);
                    return res.render(__dirname + "/views/postedit", {
                        title: 'Gönderi Düzenle',
                        stylesheet: 'postedit',
                        post: post,
                        categories:categories,
                        postcategories:postcategories
                    });
                });    
            });
        });
    });

    app.get('/Management/Post/Delete/:id', function deletePost(req, res, next) {
        Post.findByIdAndRemove(req.params.id, function (err, result) {
            if (err) console.log(err);
            console.log(result);
            Post.find({}, function (err, docs) {
                if (!docs.length) {
                    console.log('Gönderi bulunamadı');
                }
                console.log(docs);

                return res.render(__dirname + "/views/postindex", {
                    title: 'Gönderi Listesi',
                    stylesheet: 'postindex',
                    posts: docs
                });
            });
        });
    });

    app.get('/Management/Comment/Delete/:id', function deleteComment(req, res, next) {
        Comment.findByIdAndRemove(req.params.id, function (err, result) {
            if (err) console.log(err);
            console.log(result);
            Comment.find({}, function (err, docs) {
                if (!docs.length) {
                    console.log('Yorum bulunamadı');
                }
                console.log(docs);

                return res.render(__dirname + "/views/commentindex", {
                    title: 'Gönderi Listesi',
                    stylesheet: 'commentindex',
                    comments: docs
                });
            });
        });
    });

    app.get('/Management/Category/Index', function (req, res) {
        Category.find({}, function (err, categories) {
            if (!categories.length) {
                console.log('Kategori bulunamadı');
            }

            return res.render(__dirname + "/views/categoryindex", {
                title: 'Kategori Listesi',
                stylesheet: 'categoryindex',
                categories: categories
            });
        });
    });

    app.get('/Management/Category/Edit/:id', function (req, res) {
        Category.findOne({
            _id: req.params.id
        }, function (err, category) {
            console.log(category);
            if (err) return next(err);

            return res.render(__dirname + "/views/categoryedit", {
                title: 'Kategori Düzenle',
                stylesheet: 'categoryedit',
                category: category
            });
        });
    });

      app.get('/Management/Category/Delete/:id', function deleteCategory(req, res, next) {
        Category.findByIdAndRemove(req.params.id, function (err, result) {
            if (err) console.log(err);
            console.log(result);
            res.redirect('/Management/Category/Index');
        });
    });
    /*Get Friendly Site Create*/
    app.get('/Management/FriendlySite/New', function (req, res) {
        return res.render(__dirname + "/views/friendlysitecreate", {
            title: 'Dost Site Oluştur',
            stylesheet: 'friendlysitecreate'
        });
    });

    app.get('/Management/FriendlySite/Index', function(req, res){
        FriendlySite.find({}).sort({_id: -1}).exec(function(err, docs){
             if (!docs.length) {
                console.log('DostSiteBulunamadı');
            }
            return res.render(__dirname + "/views/friendlysiteindex", {
                title: 'Dost Siteler',
                stylesheet: 'friendlysiteindex',
                friendlysites: docs
            });
        });
    });

    app.get('/Management/FriendlySite/Delete/:id', function deleteFriendlySite(req, res, next) {
        FriendlySite.findByIdAndRemove(req.params.id, function (err, result) {
            if (err) console.log(err);
            console.log(result);
            FriendlySite.find({}, function (err, docs) {
                if (!docs.length) {
                    console.log('Dost site bulunamadı');
                }
                console.log(docs);

                return res.render(__dirname + "/views/friendlysiteindex", {
                    title: 'Dost Siteler',
                    stylesheet: 'friendlysiteindex',
                    moment:moment,
                    friendlysites: docs
                });
            });
        });
    });

     app.get('/Management/FriendlySite/Edit/:id', function (req, res) {
        FriendlySite.findOne({
            _id: req.params.id
        }, function (err, friendlysite) {
            console.log(friendlysite);
            if (err) return next(err);

            return res.render(__dirname + "/views/friendlysiteedit", {
                title: 'Site Düzenle',
                stylesheet: 'friendlysiteedit',
                friendlysite: friendlysite
            });
        });
    });

    /*POST*/
    app.post('/Management/Post/New', function (req, res) {
        console.log(req.body.post.categories);
        new Post({
            title: req.body.post.title,
            seotitle: urlify(req.body.post.title),
            body: req.body.post.body,
            keywords: req.body.post.keywords,
            createddate: new Date(),
        }).save(function (err, docs) {
            if (err) {
                return res.render(__dirname + "/views/createpost", {
                    title: 'Yeni Gönderi Oluştur',
                    stylesheet: 'postcreate',
                    error: ['warning', 'Gönderi oluşturulurken bir hata ile karşılaşıldı']
                });
            } else {


                var categories = req.body.post.categories;
                categories.forEach(function(category) {
                    new PostCategory({
                        postid:docs._id,
                        categoryid:category,
                        createddate:new Date()
                    }).save(function(err,docs){
                        if (err) {
                            return res.render(__dirname + "/views/createpost", {
                                title: 'Yeni Gönderi Oluştur',
                                stylesheet: 'postcreate',
                                error: ['warning', 'Gönderi oluşturulurken bir hata ile karşılaşıldı']
                            });   
                        } else{

                        }
                    });
                });

                res.redirect('/Management/Post/New');
            }
            console.log('Gönderi oluşturuldu');
        });

    });

    app.post('/Management/Post/Edit/:id', function (req, res) {
        Post.findByIdAndUpdate(req.params.id, {
            "title": req.body.post.title,
            "seotitle": urlify(req.body.post.title),
            "body": req.body.post.body,
            "keywords": req.body.post.keywords
        }, function (err, result) {
            if (err) console.log(err);
            console.log(result);
        });

        return res.render(__dirname + "/views/postedit", {
            title: 'Gönderi Düzenle',
            stylesheet: 'postedit',
            post: {
                title: req.body.post.title,
                body: req.body.post.body,
                keywords: req.body.post.keywords
            }
        });

    });

    /*Comment Confirm*/
    app.post('/Management/Comment/Confirm/', function (req, res) {
        Comment.findByIdAndUpdate(req.body.id, {
            "status": req.body.status == '0' ? 1 : 0
        }, function (err, result) {
            if (err) console.log(err);
            console.log("result:" + result);

            Comment.find({}, function (err, comments) {
                console.log("comments: " + comments)
                if (!comments.length) {
                    console.log('no comment');
                }
            });
        });
        return res.redirect('/Management/Comment/Index');
    });

    app.post('/Management/Category/New', function (req, res) {
        new Category({
            name: req.body.category.name,
            seoname: urlify(req.body.category.name),
            createddate: new Date()
        }).save(function (err, docs) {
            if (err) {
                return res.render(__dirname + "/views/categorycreate", {
                    title: 'Yeni Kategori Oluştur',
                    stylesheet: 'categorycreate',
                    error: ['warning', 'Kategori oluşturulurken bir hata ile karşılaşıldı']
                });
            } else {

                return res.render(__dirname + "/views/categorycreate", {
                    title: 'Yeni Kategori Oluştur',
                    stylesheet: 'categorycreate',
                    error: ['success', 'Kategori oluşturuldu']
                });
            }
        });
    });

     app.post('/Management/Category/Edit/:id', function (req, res) {
        Category.findByIdAndUpdate(req.params.id, {
            "name": req.body.category.name,
            "seoname": urlify(req.body.category.name)
        }, function (err, result) {
            if (err) console.log(err);
            console.log(result);
        });

        res.redirect('/Management/Category/Index');
    });

     app.post('/Management/FriendlySite/New',function(req,res){
        new FriendlySite({
            name:req.body.friendlysite.name,
            description:req.body.friendlysite.description,
            url:req.body.friendlysite.url,
            followtype:req.body.friendlysite.follow=='on'? 'Evet': 'Hayır',
            createddate:new Date()

        }).save(function(err,docs){
            if (err) {
                return res.render(__dirname + "/views/friendlysitecreate",{
                    title: 'Dost Site Oluştur',
                    stylesheet: 'friendlysitecreate',
                    error:['warning','Dost site oluştururken bir hata ile karşılaşıldı.']
                });
            } else{
                return res.render(__dirname + "/views/friendlysitecreate",{
                    title: 'Dost Site Oluştur',
                    stylesheet: 'friendlysitecreate',
                    error:['success','Dost site başarılı bir şekilde oluşturuldu.']
                });
            }
        });
     });

     app.post('/Management/FriendlySite/Edit/:id', function (req, res) {
        FriendlySite.findByIdAndUpdate(req.params.id, {
            "name": req.body.friendlysite.name,
            "description": req.body.friendlysite.description,
            "url": req.body.friendlysite.url,
            "followtype": req.body.friendlysite.follow=='on'? 'Evet': 'Hayır',
        }, function (err, result) {
            if (err){
                console.log(err);
            
                return res.render(__dirname + "/views/friendlysiteedit", {
                    title: 'Site Düzenle',
                    stylesheet: 'friendlysiteedit',
                    friendlysite: {
                        name: req.body.friendlysite.name,
                        description: req.body.friendlysite.description,
                        url: req.body.friendlysite.url,
                        followtype:req.body.friendlysite.follow=='on'? 'Evet': 'Hayır'
                    },
                    error:['warning','Dost site kaydedilirken bir hata ile karşılaşıldı.']
                });                
            }
             
            console.log(result);
        });

        return res.render(__dirname + "/views/friendlysiteedit", {
            title: 'Site Düzenle',
            stylesheet: 'friendlysiteedit',
            friendlysite: {
                name: req.body.friendlysite.name,
                description: req.body.friendlysite.description,
                url: req.body.friendlysite.url,
                followtype:req.body.friendlysite.follow=='on'? 'Evet': 'Hayır'
            },
            error:['success','Dost site başarılı bir şekilde güncellendi.']
        });

    });
};

module.exports = routes;