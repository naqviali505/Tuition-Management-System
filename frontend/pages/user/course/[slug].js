import { useRouter } from "next/router"
import { useEffect,useState,createElement } from "react";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import {Button,Menu,Avatar} from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { PlayCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CheckCircleOutlined,
    MinusCircleFilled, 
} from "@ant-design/icons";



const {Item} = Menu;





const SingleCourse =()=>
{
    const [clicked,setClicked] = useState(-1);
    const [collapsed,setCollapsed] = useState(false);

    const [completedLesson,setCompletedLesson] = useState({});
    const {slug} = router.query;
    const [loading,setLoading] = useState(false);
    const [course,setCourse] = useState({lessons:[]});
    // force state update
    const [updateState,setUpdateState] = useState(false);

    const router = useRouter();


    useEffect(()=>
    {
        if(slug)
        {
            loadCourse();
        }
    },[slug]);

    useEffect(()=>
    {
        if(course)
        {
            loadCompletedLessons();
        }
    }),[course];

    const loadCompletedLessons = async()=>
    {
        const {data} = await axios.post(`/api/list-completed`,{ 
             courseId:course._id, 
        });
        console.log("COMPLETED LESSONS => ",data);
        setCompletedLesson(data.length);
    };

    const loadCourse = async ()=>
    {
        const {data} = await axios.get(`/api/user/course/${slug}`);
        setCourse(data);
    };

    const markCompleted=async()=>
    {
        const{data}= await axios.post(`/api/mark-completed`,{
            courseId:course._id,
            lessonId:course.lessons[clicked]._id,

        });
        setCompletedLesson([...completedLesson,course.lessons[clicked]._id]);
            
    };

    const markIncompleted=async()=>
    {
        try
        {
            const {data} = await axios.post(`/api/mark-incompleted`,
            {
                courseId:course._id,
                lessonId:course.lessons[clicked]._id,
            });
            const all=completedLesson;
            const index=all.indexOf(course.lessons[clicked]._id);
            if(index>-1)
            {
                all.splice(index,1);
                setCompletedLesson(all);
                setUpdateState(!updateState)
            }
        } catch(err)
        {
            console.log(err);
        }



    };

    return(
        <StudentRoute>
        <div className="row">
            <div style={{maxWidth:"320"}}>
                <Button onClick={()=>setCollapsed(!collapsed)}
                 className="text-primary mt-1 btn-block mb-2">
                   {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
                   {collapsed && "Lessons"} 
                 </Button>
                <Menu
                    defaultSelectedKeys={[clicked]} 
                    inlineCollapsed={collapsed}
                    style={{height:"100vh",overflow:"scroll"}}
                >
                    {course.lessons.map((lesson,index)=>
                    {
                        <Item
                            onClick={()=>setClicked(index)}
                            key={index}
                            icon={<Avatar>{index+1}</Avatar>}

                        >
                            {lesson.title.substring(0,30)}
                            {completedLesson.includes(lesson._id) ? (
                            <CheckCircleOutlined
                             className="float-right text-primary ml-2"
                            style={{marginTop:"13px"}}
                            />
                            ):(
                                <MinusCircleFilled 
                                className="float-right text-danger ml-2"
                                style={{marginTop:"13px"}}
                                />
                            )}

                        </Item>
                    }
                    )}
                </Menu>
            </div>
            <div className="col">{clicked!=-1 ?(
            <>

            <div className="col alert-primary square">
                <b>{course.lessons[clicked].title.substring(0,30)}</b>
                {completedLesson.includes(course.lessons[clicked]._id) ? (
                <span 
                className="float-right pointer" 
                onClick={markIncompleted}>
                    Mark as Incomplete
                </span>
                ):(
                    <span
                    className="float-right pointer" 
                    onClick={markCompleted}>
                    Mark as Completed
                </span>
                ) }
            </div>
            {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                <>
                <div className="wrapper">
                    <ReactPlayer 
                    className="player" 
                    url={course.lessons[clicked].video.Location} 
                    width="100%" 
                    height="100%" 
                    controls
                    onEnded={()=>markCompleted()}
                    />
                </div>
                 



                 
                </>
            )}
            <ReactMarkdown 
                source={course.lessons[clicked].content}
                className="single-post"



                />
            </>
            ):(
                <div className="d-flex justify-content-center p-5">
                    <div className="text-center p-5">
                        <PlayCircleOutlined className="text-primary display-1 p-5"/>
                        <p className="lead">Click on the lessons to start learning</p>

                    </div>

                    
                </div>
            
            )}

            </div>
        </div>
        </StudentRoute>
    )
};
export default SingleCourse;