import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import {AddLessonForm} from "../../../../components/forms/AddLessonForm";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { EditOutlined,
    QuestionOutlined,
    CheckOutlined,
    UploadOutlined, 
    QuestionOutlined,
    UserSwitchOutlined,
CloseOutlined, } from "@ant-design/icons";
import {Avatar,Tooltip,Button,Modal,List} from "antd";
import {toast} from "react-toastify";
import ReactMarkdown from "react-markdown";

const CourseView = () => 
{
    const [course, setCourse] = useState({});
    const router = useRouter();
    const {slug} = router.query;
    const [progress,setProgress]=useState(0);
    //student count
    const [students,setStudents]=useState(0);




    const [values,setValues]=useState({
        title:"",
        content:"",
        video:{},
    });
    const [uploading,setUploading]=useState(false);
    const[uploadButtonText,setUploadButtonText]=useState("Upload Video");
    const[visible,setVisible]=useState(false);
    useEffect(() =>
    {
        loadCourse();

    }, [slug]);


    useEffect(() =>
    {   
        course && studentCount();

    },[course]);


    const studentCount = async () =>
    {
        const {data} = await axios.post(`/api/instructor/student-count`,{
            courseId:course._id});
        console.log("STUDENT COUNT => ",data);
        setStudents(data.length);   
    }

    const loadCourse = async () =>
    {
        const {data} = await axios.get(`/api/course/${slug}`);
        setCourse(data);

    }
    const handleAddLesson = async (e) =>
    {
        e.preventDefault();
        // console.log(values);
        try
        {
            const {data} = await axios.post(`/api/course/lesson/${slug}/${course.instructor_id}`,values);
            setValues({...values,title:"",content:"",video:{}});
            setProgress(0);
            setCourse(data);
            setVisible(false);
            
            toast("Lesson added");
        }
        catch(err)
        {
            console.log(err);
            toast("Add lesson failed");
        }
    }
    const handleVideo = async (e) =>
    {
        try
        {
            const file = e.target.files[0];
            setUploadButtonText(file.name);
            setUploading(true);
            
            const videoData = new FormData();
            videoData.append("video",file);
            const {data} = await axios.post(`/api/course/video-upload/${course.instructor_id}`,videoData,{
                onUploadProgress: (e) => 
                {
                    setProgress(Math.round((100 * e.loaded) / e.total))
                }
            });
            console.log(data);
            setValues({...values,video:data});
            setUploading(false);

        } catch(err)    
        {
            console.log(err);
            toast("Video upload failed");
            setUploading(false);
        }

    }

    const handleVideoRemove = async () =>
    {
        try
        {
            setUploading(true);
            const {data} = await axios.post(`/api/course/video-remove/${course.instructor_id}`,values.video);
            console.log(data);
            setValues({...values,video:{}});
            setProgress(0);
            setUploading(false);
            setUploadButtonText("Upload another Video");


        } catch(err)
        {
            console.log(err);
            setUploading(false);
            toast("Video remove failed");
        }
    }
    const handlePublish = async (e,courseId) =>
    {
        try
        {
            let answer = window.confirm(
                "Once you publish your course, it will be live in the marketplace for users to enroll"
                );
                if(!answer) return;
                const {data} = await axios.put(`/api/course/publish/${courseId}`)
                setCourse(data);
                toast("Congrats! Your course is live");
            } catch(err)
        {
            toast("Course publish failed. Try again");
        }
            
    
    };
    const handleUnpublish = async (e,courseId) =>
    {
        try
         {
            let answer = window.confirm(
                "Once you publish your course, it will not be available for users to enroll");
            if(!answer) return;
            const {data} = await axios.put(`/api/course/unpublish/${courseId}`)
            setCourse(data);
            toast("Congrats! Your course is unpublished");
        } catch(err)
        {
            toast("Unable to unpublish the course.Please try again.");
        }
    };

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
                {/* <pre>{JSON.stringify(course,null,4)}</pre> */}
                {course && (
                <div className="container-fluid pt-1">
                    <div className="media pt-2">
                        <Avatar size = {80} src={course.image ? course.image.Location : "/course.png"} 
                        />
                        <div className="media-body pl-2">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mt-2 text-primary">
                                        {course.name}
                                    </h5>
                                    <p style={{marginTop:"-10px"}}>
                                        {course.lessons && course.lessons.length} Lessons
                                    </p>
                                    <p style={{marginTop:"-15px",fontSize:"10px"}}>
                                        {course.category}
                                    </p>
                                </div>
                                <div className="d-flex pt-4">
                                <Tooltip title={`${students}`} Enrolled>
                                <UserSwitchOutlined className="h5 pointer text-info mr-4" />
                            </Tooltip>
                            <Tooltip title="Edit">
                                <EditOutlined onClick={()=> 
                                    router.push('/instructor/course/edit/${slug}')} className="h5 pointer text-warning mr-4" />
                            </Tooltip>

                            {course.lessons && course.lessons.length < 5 ? (
                            <Tooltip title="Min 5 lessons required to publish">
                                <QuestionOutlined className="h5 pointer text-danger" />

                            </Tooltip>
                            ): course.published ? (
                            <Tooltip title="Unpublish">
                                <CloseOutlined 
                                onClick={(e)=>handleUnpublish(e,course._id)} 
                                className="h5 pointer text-danger" />
                            </Tooltip>
                            ):(
                            <Tooltip title="Publish">
                                <CheckOutlined 
                                onClick={(e)=>handlePublish(e,course._id)} 
                                className="h5 pointer text-success" />
                            </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
                        
            </div>
            <hr/>
                    <div className="row">
                        <div className="col">
                            <ReactMarkdown source={course.description}/>
                        </div>

                    </div>
                    <div className="row">
                        <Button
                        onClick={() => setVisibile(true)}
                        className="col-md-6 offset-md-3 text-center"
                        type="primary"
                        shape="round"
                        icon={<UploadOutlined/>}
                        size="large"
                        >
                            Add Lesson
                        </Button>
                    </div>
                    <br/>
                    <Modal title="+ Add Lesson"
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}


                    >
                        <AddLessonForm 
                        values={values} 
                        setValues={setValues}
                        handleAddLesson={handleAddLesson}
                        uploading={uploading}
                        uploadButtonText={uploadButtonText}
                        handleVideo={handleVideo}
                        progress={progress}
                        handleVideoRemove={handleVideoRemove}

                        

                        />
                    </Modal>

                    <div className="row pb-5">
                        <div className="col lesson-list">
                            <h4>{course && course.lessons && course.lessons.length}</h4>
                            <List itemLayout="horizontal" dataSource={course && course.lessons} renderItem={(item,index)=>(
                                <Item>
                                    <Item.Meta avatar={<Avatar>{index+1}</Avatar>}
                                    title={item.title} 
                                    >

                                    </Item.Meta>
                                </Item>
                )}></List>
                        </div>
                    </div>

                </div>
                )}
            </div>
        </InstructorRoute>
    );
};
export default CourseView;