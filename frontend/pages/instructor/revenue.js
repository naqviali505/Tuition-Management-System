import { useState,useEffect,useContext } from "react";
import {Context} from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import { DollarOutlined,
    SettingOutlined,
    LoadingOutlined, 
    SyncOutlined} 
    from "@ant-design/icons";
import { stripecurrencyFormatter } from "../../utils/helper";

const InstructorRevenue = () => 
{
    const [balance,setBalance] = useState({pending:[] });
    const [loading,setLoading] = useState(false);

    useEffect(()=>
    {
        sendBalanceRequest();
    },[]);


    const sendBalanceRequest = async()=>
    {
        const {data} = await axios.get("/api/instructor/balance");
        console.log("BALANCE ON PENDING REQUEST => ",data);
        setBalance(data);
    };

    const handlePayoutSettings = async()=>
    {
        try
        {
            setLoading(true);
            const {data} = await axios.get("/api/instructor/payout-settings");
            window.location.href = data;
        }
        catch(err)
        {
            setLoading(false);
            console.log(err);
            alert("Unable to access payout settings. Try later.");
        }
    };

    return(
        <InstructorRoute>
            <div className="container">
                <div className="row pt-2">
                    <div className="col-md-8 offset-md-2 bg-light p-5">
                        <h2>Revenue Report <DollarOutlined className="float-right"/></h2>
                        <small>Revenue report shows the list of payments pending from website to your account every 48 hours.</small>
                        <hr/>
                        <h4>Pending Balance
                            {balance.pending && balance.pending.map((bp,i)=>
                            (
                                <span key={i} className="float-right">{stripecurrencyFormatter(bp)}</span>
                            
                            ))}
                             
                            </h4>
                        <small>For last 48 hours</small>
                        <h4>
                            Payouts{" "} 
                            {!loading ? <SettingOutlined 
                            className="float-right" 
                            onClick={handlePayoutSettings}
                            />:<SyncOutlined spin className="float-right"/>}
                        </h4>
                        <small>Small your stripe account details or view previous payouts.</small>
                    
                    </div>
                </div>
            </div>
        </InstructorRoute>
    )
};
export default InstructorRevenue;