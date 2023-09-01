import {nanoid} from "nanoid";
import Course from "../models/course";
import slugify from "slugify";
import {readFileSync} from "fs";
import User from "../models/user";
import Completed from "../models/completed";

const stripe=require('stripe')(process.env.STRIPE_SECRET);
    
export const uploadImage = async (req, res) => 
{
    try
    {
        const {image} = req.body;
        if(!image) return res.status(400).send('No image');
        //prepare image
        const base64Data = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''), 
            'base64');
        const type = image.split(';')[0].split('/')[1];
        //image params
        const params = {
            Bucket: 'edemy-bucket',
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`,
        };



    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error. Try again.');
    }

};
export const removeImage = async (req, res) =>
{
    try
    {
        const {image} = req.body;
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,
        };

    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error. Try again.');
    }
}
export const create = async (req, res) =>
{
    try
    {
        const alreadyExist = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase()),
        }).exec();
        if(alreadyExist) return res.status(400).send('Title is taken');
        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.user._id,
            ...req.body,
        }).save();
        res.json(course);
    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while creating courses. Try again.');
    }
}
export const read = async (req, res) =>
{
    try
    {
        const course = await Course.findOne({slug: req.params.slug}).populate(
            'instructor', 
            '_id name')
            .exec();
        res.json(course);
    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while reading courses. Try again.');
    }

}

export const uploadVideo = async (req, res) =>
{
    try
    {
        if(req.user._id != req.params.instructorId) return res.status(400).send('Unauthorized');
        const {video} = req.files;
        if(!video) return res.status(400).send('No video');
        const params = {
            Bucket: 'edemy-bucket',
            Key: `${nanoid()}.${video.type.split('/')[1]}`,
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type,


            
        
        };


    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while uploading video. Try again.');
    }  
}
export const removeVideo = async (req, res) =>
{
    try
    {
        if(req.user._id != req.params.instructorId) return res.status(400).send('Unauthorized');
        const {Bucket,Key} = req.body;
        
        const params = {
            Bucket,
            Key,
        };


    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while uploading video. Try again.');
    }  
};

export const addLesson = async (req, res) =>
{
    try
    {
        const {slug, instructorId} = req.params;
        const {title, content, video} = req.body;
        if(req.user._id != instructorId) return res.status(400).send('Unauthorized');
        const updated = await Course.findOneAndUpdate({slug}, 
            {$push: {lessons: {title, content, video, slug: slugify(title)}},
        },
            {new: true}
        ).populate('instructor', '_id name').exec();
        res.json(updated);
    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while adding lesson. Try again.');
    }  
}

export const update = async (req, res) =>
{
   try
   {
    const {slug} = req.params;
    const course= await Course.findOne({slug}).exec();
     if(req.user._id != course.instructor) return res.status(400).send('Unauthorized');
 
     const updated= await Course.findOneAndUpdate({slug}, req.body, {new: true}).exec();
     res.json(updated);
   } catch(err)
   {
         console.log(err);
         return res.status(400).send('Error while updating course. Try again.');
   }

};

export const removeLesson = async (req, res) =>
{
    const {slug, lessonId} = req.params;
    const course= await Course.findOne({slug}).exec();
    if(req.user._id != course.instructor) return res.status(400).send('Unauthorized');

    const deletedCourse = await Course.findByIdAndUpdate(course._id,{
        $pull: {lessons: {_id: lessonId}},
    }).exec();
    res.json(updated);
};

export const updateLesson = async (req, res) =>
{
    try
    {
        const {slug} = req.params;
        const {lessonId,title, content, video, free_preview} = req.body;
        const course= await Course.findOne({slug}).select("instructor").exec();

        if(req.user._id != course.instructor) return res.status(400).send('Unauthorized');

        const updatedCourse = await Course.updateOne(
            {'lessons._id': lessonId},
            {
                $set: {
                    'lessons.$.title': title,
                    'lessons.$.content': content,
                    'lessons.$.video': video,
                    'lessons.$.free_preview': free_preview,
                },
            },
            {new: true}
        ).exec();
        res.json({ok: true});
    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error while updating lesson. Try again.');
    }
};

export const publishCourse = async (req, res) =>
{
    try
    {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select('instructor').exec();
        if(req.user._id != course.instructor._id) return res.status(400).send('Unauthorized');

        const updated = await Course.findByIdAndUpdate(courseId, {published: true}, {new: true}).exec();
        res.json(updated);


    } catch(err)
    {
        return res.status(400).send('Error. Try again.');
    }

}
export const unpublishCourse = async (req, res) =>
{
    try
    {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select('instructor').exec();
        if(req.user._id != course.instructor._id) return res.status(400).send('Unauthorized');
        const updated = await Course.findByIdAndUpdate(courseId, {published: false}, {new: true}).exec();
        res.json(updated);

    } catch(err)
    {
        return res.status(400).send('Error. Try again.')
    }

}
export const courses = async(req,res)=>
{
    const all=await Course.find({published:true})
    .populate("instructor","_id name")
    .exec();
    res.json(all);
}

export const checkEnrollment = async (req, res) =>
{
    try
    {
        const {courseId} = req.params;
        const user = await User.findById(req.user._id).exec();
        let ids = [];
        let length = user.courses.length;
        for(let i=0; i<length; i++)
        {
            ids.push(user.courses[i].toString());
        }
        res.json({
            status: ids.includes(courseId),
            course: await Course.findById(courseId).exec(),
        });


    } catch(err)
    {
        return res.status(400).send('Error while enrolling for paid course. Try again.');
    }
};

export const freeEnrollment = async (req, res) =>
{
    try
    {
        
        const course = await Course.findById(req.params.courseId).exec();
        
        if(courses.paid) return;

        const updated = await Course.findByIdAndUpdate(req.user._id, {
            $addToSet: {courses: course._id},
        },
        {new: true}
        ).exec();
        res.json({
            message: 'Congratulations! You have successfully enrolled for this course.',
            course,

        });

    } catch(err)
    {
        return res.status(400).send('Error while enrolling for free. Try again.');
    }
};

export const paidEnrollment = async (req, res) =>
{
    try
    {

        const course= await Course.findById(req.params.courseId)
        .populate('instructor')
        .exec();
        if(!course.paid) return;
        const fee = (course.price * 30) / 100;
        const session= await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    name: course.name,
                    amount: Math.round(course.price.toFixed(2) * 100),
                    currency: 'usd',
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                application_fee_amount: Math.round(fee.toFixed(2) * 100),
                transfer_data: {
                    destination: course.instructor.stripe_account_id,
                },
            },
            success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });
        await User.findByIdAndUpdate(req.user._id, {
            stripeSession: session,
        }).exec();
        res.send(session.id);

    } catch(err)
    {
        return res.status(400).send('Enrollment create failed. Try again.');
    }
};

export const stripeSuccess = async (req, res) =>
{
    try
    {
        const course = await Course.findById(req.params.courseId).exec();
        const user = await User.findById(req.user._id).exec();
        if(!user.stripeSession.id) return res.sendStatus(400);
        const session = await stripe.checkout.sessions.retrieve(
            user.stripeSession.id
        );
        if(session.payment_status === 'paid')
        {
            await User.findByIdAndUpdate(user._id, {
                $addToSet: {courses: course._id},
                $set: {stripeSession: {}},
            }).exec();
            res.json({success: true, course});
        }
    } catch(err)
    {
        res.json({success:false})
    }
};

export const userCourses = async (req, res) =>
{
    try
    {
        const user = await User.findById(req.user._id).exec();
        const courses = await Course.find({_id: {$in: user.courses}})
        .populate('instructor', '_id name')
        .exec();
        res.json(courses);
    } catch(err)
    {
        console.log(err);
    }
};

export const markCompleted = async (req, res) =>
{
    const {courseId, lessonId} = req.body;
    const existing = await Completed.findOne({
        user: req.user._id,
        course: courseId,
        
    }).exec();
    if(existing)
    {
        const updated = await Completed.findOneAndUpdate(
            {
                user: req.user._id,
                course: course,
            },
            {
                $addToSet: {lessons: lessonId},
            }
        ).exec();
        res.json({ok: true});
    }
    else
    {
        const created = await new Completed({
            user: req.user._id,
            course: courseId,
            lessons: lessonId,
        }).save();
        res.json({ok: true});
    }
};

export const listCompleted = async (req, res) =>
{
    try
    {
        const list = await Completed.findOne({
            user: req.user._id,
            course: req.body.courseId,

        }).exec();
        list && res.json(list.lessons);

    } catch(err)
    {
        console.log(err);
    }
};

export const listIncomplete = async (req, res) =>
{
    try
    {
        const {courseId,lessonId} = req.body;
        const updated = await Completed.findOneAndUpdate
        ({
            user: req.user._id,
            course: courseId,
        },{
            $pull: {lessons: lessonId},

        }
        ).exec();
        res.json({ok: true});
    } catch(err)
    {
        console.log(err);
    }
};