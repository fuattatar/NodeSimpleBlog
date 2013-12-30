var routes= function (app) {
	var mongoose = require('mongoose');
	var Post = mongoose.model('Post');
	var Comment = mongoose.model('Comment');
	var moment =require('moment');
	var Category=mongoose.model('Category');
	var PostCategory=mongoose.model('PostCategory');
	var FriendlySite=mongoose.model('FriendlySite');
	var urlify = require('urlify').create({
	  addEToUmlauts:true,
	  szToSs:true,
	  spaces:"-",
	  nonPrintable:"-",
	  trim:true
	});

	////Error nesnesini null tanımlıyoruz
	app.locals.error=null;

	function generate_xml_sitemap(res) {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var urls = ['about.html', 'javascript.html', 'css.html', 'html5.html'];
    // the root of your website - the protocol and the domain name with a trailing slash
    var root_path = 'http://www.fuattatar.com/';
    // XML sitemap generation starts here
    var postpriority = 0.5;
    var categorypriority = 0.3;
    var freq = 'weekly';
    var xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/xmlschema-instance" xsi:schemalocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
    Post.find({}).sort({createddate: -1}).exec(function(err, docs){
    	Category.find({}).sort({createddate: -1}).exec(function(err, categories){
    		for (var i = 0; i < docs.length; i++) {
				console.log(docs[i].seotitle);
				xml += '<url>';
		        xml += '<loc>'+ root_path +'post/'+ docs[i].seotitle + '</loc>';
		        xml += '<changefreq>'+ freq +'</changefreq>';
		        xml += '<priority>'+ postpriority +'</priority>';
		        xml += '</url>';
    		};
			
			for (var i = 0; i < categories.length; i++) {
				
				xml += '<url>';
		        xml += '<loc>'+ root_path +'Kategori/'+ categories[i].seoname + '</loc>';
		        xml += '<changefreq>'+ freq +'</changefreq>';
		        xml += '<priority>'+ categorypriority +'</priority>';
		        xml += '</url>';
    		};
		    xml += '</urlset>';
		    res.header('Content-Type', 'text/xml');
			res.send(xml);		
    	});
    	
	});
	}

	app.get('/sitemap.xml', function(req, res) {
    	generate_xml_sitemap(res); // get the dynamically generated XML sitemap
         
	})
	app.get('/',function(req, res){
		
		Post.find({}).sort({_id: -1}).exec(function(err, docs){
			if(! docs.length) {
				console.log('Gönderi bulunamadı');
			}
			console.log(docs);
				
			Category.find({}).sort({_id: -1}).exec(function(err, categories){
				FriendlySite.find({}).sort({_id:-1}).exec(function(err,sites){
					return res.render(__dirname+"/views/index",{
						title: 'Fuat Tatar Software Developer',
						stylesheet: 'blog',
						posts:docs,
						urlify:urlify,
						categories:categories,
						description:'Hobisi ve mesleği Yazılım olan Software Developer',
						sites:sites
					});	
				});
			});
		});		
	});


	app.get('/Iletisim',function(req,res){

		return res.render(__dirname + "/views/contact",{
			title: 'İletişim',
			stylesheet: 'contact',
			description: 'Fuat Tatar ile iletişime geçin'
		});
	});
	
	app.get('/Kategori/:seoname',function(req,res){

		Category.findOne({seoname:req.params.seoname},function(err, category){
			if(err) return next(err);
			console.log('kategori id:'+category._id);
			PostCategory.find({categoryid:category._id+''},function(err,postcategories){
				if(err) return next(err);
				console.log('post kategorileri:'+postcategories);
				var ids = [];
				postcategories.forEach(function(postcategory){
					ids.push(postcategory.postid);
				});
				 console.log('idlerrrr:'+ids);
				Post.find({_id:{ $in : ids }},function(err,posts){
				console.log('postlarrrr'+posts);
				if(err) return next(err);
					return res.render(__dirname + "/views/categorydetail",{
						title: req.params.seoname+' kategorisinde bulunan yazılar',
						stylesheet: 'categorydetail',
						urlify:urlify,
						posts:posts,
						description:category.name+' kategorisinde bulunan yazılar',
						keywords: category.name+' kategorisinde bulunan yazılar'
					});
				});	
			});
		});
	});
	
	app.get('/Hakkimda',function(req,res){

		return res.render(__dirname + "/views/about",{
			title: 'Hakkımda',
			stylesheet: 'about',
			description: 'Fuat Tatar hakkında',
			keywords:'Fuat Tatar Hakkımda,Hakkımda,Fuat Tatar'
		});
	});
	
	app.get('/Post/:title',function(req,res){
		Post.findOne({seotitle:req.params.title},function(err, post){
			if(err) return next(err);
				Comment.find({postid:post._id,status:1},function(err, comments){
				if(err) {
					console.log("yorum bulunamadı");
					return next(err);
				}
					PostCategory.find({postid:post._id},function(err, postcategories){
						if(err) return next(err);
						Post.find({seotitle:{$ne:req.params.title}},function(err,singlepost){
							
							return res.render(__dirname+"/views/postdetail",{
								title: post.title,
								stylesheet: 'postdetail',
								post:post,
								keywords:post.keywords,
								comments:comments,
								postcategories:postcategories,
								moment:moment,
								description:post.title,
								singlepost:singlepost[Math.floor((Math.random()*singlepost.length))]
							});
						});
					});
				});
			});
	});

	app.post('/Post/Comment',function(req, res){
		 new Comment({
        email:req.body.comment.email,
        website:req.body.comment.website,
        content:req.body.comment.content,
        postid:req.body.comment.postid,
        createddate:new Date(),
        status:0
      }).save(function (err, docs){
        if(err) {res.json({success: false});}else{ res.json({success: true}); }
        console.log('Gönderi oluşturuldu');
      });
	});

	app.post('/Iletisim',function(req,res){
		console.log('contactttttt');
		var nodemailer= require("nodemailer");
		var smtpTransport = nodemailer.createTransport("SMTP",{
		    service: "Hotmail",
		    auth: {
		        user: "ftdeveloperacc@outlook.com",
		        pass: "PsmSalamanda"
		    }
		});

		var mailOptions = {
		    from: req.body.email, // sender address
		    to: "fuat.tatar@hotmail.com", // list of receivers
		    subject: req.body.name, // Subject line
		    text: req.body.text // plaintext body
		}
		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		        return res.render(__dirname + "/views/contact",{
					title: 'İletişim',
					stylesheet: 'contact',
					error:'Bir hata oldu. Kısa sürede halledeceğim.'
					
				});

		    }else{
		        console.log("Message sent: " + response.message);
				        return res.render(__dirname + "/views/contact",{
					title: 'İletişim',
					stylesheet: 'contact',
					error: 'Mesajınız başarılı bir şekilde gönderilmiştir. En kısa sürede cevap vermeye çalışacağım'
				});

		    }
		});
	});
};

module.exports = routes;