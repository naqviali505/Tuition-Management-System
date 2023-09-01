import {Modal} from 'antd';
import ReactPlayer from 'react-player';

const PreviewModal = ({showModal,setShowModal,preview}) => 
{
    return( 
        <Modal
        title="Course Preview"
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        footer={null}
        width={720}

        >
            <div className="wrapper">
                <ReactPlayer 
                url={preview}
                playing={showModal}
                controls={true}
                width="100%"
                height="100%"

                />
            </div>
        </Modal>
    )
};

export default PreviewModal;