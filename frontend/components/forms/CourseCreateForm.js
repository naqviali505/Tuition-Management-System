import { Select,Button,Avatar,Badge } from "antd";

const {Option} = Select;
const CourseCreateForm = (
    {handleSubmit,
    handleImage,
    handleChange,
    values,
    preview,
    setValues,
    handleImageRemove=(f) => f,
    uploadButtonText,
    editPage=false,

    }) =>
    {
        const children = [];
        for(let i = 9.99; i <= 100.99; i++)
        {
            children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
        }
        return (
            <>
            {values && (
            <form onSubmit={handleSubmit} >
            <div className="form-group">
                <input type="text" 
                name="name" 
                className="form-control" 
                placeholder="Name" 
                onChange={handleChange} 
                value={values.name} 
                />
            </div>
            <div className="form-group">
               <textarea name="description" cols="7" rows="7" className="form-control" placeholder="Description" onChange={handleChange} value={values.description} ></textarea> 
            </div>
            <div className="form-row">
                <div className="col">
                    <div className="form-group">
                        <Select
                        style={{width: "100%"}}
                        size="large"

                        value={values.paid}
                        onChange={(v) => setValues({...values, paid: v,price:0})}
                            >
                            <Option value={true}>Pai d</Option>
                            <Option value={false}>Free</Option>

                        </Select>
                    </div>    
                </div>
               {
                    values.paid && 
                    <div className="form-group">
                        <Select
                        defaultValue="$9.99"
                        style={{width: "100%"}}
                        onChange={(v) => setValues({...values, price: v})}
                        tokenSeparators={[,]}
                        size="large"

                        >
                             {children}

                        </Select>
                    </div>
                    
               } 
            </div>
            <div className="form-group">
                <input type="text" 
                name="category" 
                className="form-control" 
                placeholder="Category" 
                onChange={handleChange} 
                value={values.category} 
                />
            </div>

            <div className="form-row">
                <div className="col">
                    <div className="form-group">
                        <label className="btn btn-outline-secondary btn-block text-left">
                           {uploadButtonText}
                            <input type="file" name="image" onChange={handleImage} accept="image/*" hidden /> 
                        </label>
                    </div>
                </div>
                {preview &&(
                        <Badge count="X" onClick={handleImageRemove} className="pointer">
                            <Avatar width={200} src={preview} />
                        </Badge>

                )}
                {editPage ? "true":"false"}
                {editPage && values.image && (  <Avatar width={200} src={values.image.Location} />)}
            </div>

            <div className="row">
                <div className="col">
                    <Button onClick={handleSubmit} disabled={values.loading || values.uploading}
                    className="btn btn-primary"
                    loading={values.loading}
                    type="primary"
                    shape="round"
                    size="large"

                    >
                    {values.loading ? "Saving..." : "Save & Continue"}
                        Save</Button>
                </div>
            </div>
        </form>
             
            )}
            </>
            
        );
    };
    
 


export default CourseCreateForm;