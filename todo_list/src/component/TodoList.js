import React, {useEffect, useState } from 'react';
import axios from 'axios';
import {Container} from '@material-ui/core/';
import {Table} from '@material-ui/core/';
import {TableBody} from '@material-ui/core';
import {TableCell} from '@material-ui/core';
import {TableContainer} from '@material-ui/core';
import {TableHead} from '@material-ui/core';
import {TableRow} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import {Checkbox} from '@material-ui/core/';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core/';
import {Box} from '@material-ui/core/';
import {Grid} from '@material-ui/core/';

import {Modal} from '@material-ui/core/';
import {Fade} from '@material-ui/core/';

const TodoList = () => {
    const [datas, setDatas] = useState([]);
    const [addBtn, setAddBtn] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [changeTitle, setChangeTitle] = useState(datas.title);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedId, setSelectedId] = useState(0);

    // ========================
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleDetail = (id, title) => {
        console.log(id);
        console.log(title);
        setSelectedId(id);
        setSelectedTitle(title);
        setOpen(true);
    }

    //============================
    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/todos")
            .then(response => setDatas(response.data))
            .catch(err => console.log(err));
    }, []);
    
    // useEffect(() => {
    //     const list = [...datas];
    //     const re_list = list.reverse();
    //     console.log('솔팅팅', re_list);
    // })

    /*
    const onChange = e => {
        const {value, name} = e.target;
        setInput({
            ...input,
            [name] : value
        });
    };
    */

    const onSave = () => {
        const newTodo = {
            userId : "1",
            id: datas.length + 1,
            title: newTitle,
            completed: false
        }
        setDatas([...datas, newTodo]);
        setNewTitle("");
    }

    const onDelete = id => {
        setDatas(datas.filter(item => item.id !== id));
    };

    const onChangeHandler = (e) => {
        console.log('onChangeHandler' , setChangeTitle(e.target.value));
        setChangeTitle(e.target.value);
        // const { name, value } = e.target;
        // setChangeTitle({
        //     ...changeTitle,
        //     [name] : value
        //})
    }

    function update(id, updatedData) {
        return axios.put(DOMAIN+'/api/boards/'+id, updatedData);
    }
    
    const modifyData = (id, updatedData, allData) => dispatch => {
        return update(id, updatedData)
            .then(response => {
                allData.forEach(function (element) {
                    if(element.id == id){
                        for (var key in updatedData){
                            element[key] = updatedData[key];
                        }
                        return;
                    }
                })
    
                dispatch({
                    type: type.MODIFY_DATA,
                    payload: allData,
                })
            }).catch(error => {
                /* error control */
            })
    }

    const handleModify = (updatedData) => {
        modifyData(datas.id, updatedData, selectData.slice(0));
    }

    const combineData = () => {
        return {
            title : title
        }
    }
    const onSubmit = (e) => {
        console.log('수정할꺼야');
        e.preventDefault();

        const updatedData = combineData();
        handleModify(updatedData);
        setIsUpdate(false);

        // if (!datas.id) {
        //     setDatas (
        //         datas.map(changeTitle => datas.id === changeTitle.id ? {
        //         id : datas.id,
        //         title : datas.title,
        //     } : changeTitle))
        //     console.log(changeTitle);
        // } else {

        //     console.log('수정할꺼야11');
        // }
        // setIsUpdate(false);
    }
   

    return (
        <Container maxWidth="lg">
            <h2>Todo List</h2>
            <Box component="div" style={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                <Button variant="outlined" color="primary" size="small" onClick={() => setAddBtn(!addBtn)}>Add</Button>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={addBtn?12:10}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">Id</TableCell>
                                    <TableCell align="center">Title</TableCell>
                                    <TableCell align="center">Completed</TableCell>
                                    <TableCell align="center">Update</TableCell>
                                    <TableCell align="center">Delete</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                                {datas.map((item) => (
                                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
                                        <TableCell align="center">{item.id}</TableCell>
                                        {isUpdate===item.id?(
                                            <TableCell align="center"><TextField id="filled-basic"  variant="filled" fullWidth InputLabelProps={{shrink: true,}} value={item.title} label={item.title} onChange={onChangeHandler}/></TableCell>
                                            ):( 
                                            <TableCell align="center" >{item.title}</TableCell>
                                        )}
                                                
                                        <TableCell align="center">
                                            <Checkbox checked={item.completed} color="primary" />
                                        </TableCell>

                                        {isUpdate === item.id ? (
                                        <TableCell align="center"><Button variant="outlined" color="primary" size="small" value="submit" onClick={onSubmit}>Submit</Button></TableCell>  
                                        ):(
                                        <TableCell align="center"><Button variant="outlined" color="primary" size="small" value="update" onClick={()=>(setIsUpdate(item.id))}>Update</Button></TableCell>
                                        )}

                                        <TableCell align="center"><Button variant="outlined" color="primary" size="small" onClick={()=>{if(window.confirm(`${item.id}번째 데이터 삭제할까염?`)){onDelete(item.id)}}}>Delete</Button></TableCell>
                                        {/* <TableCell><Button variant="outlined" color="primary" size="small">Detail</Button></TableCell>  */}
                                        <TableCell>
                                            <Button variant="outlined" color="primary" size="small" onClick={()=>handleDetail(item.id, item.title)}>Detail</Button>
                                        </TableCell> 
                                    </TableRow>
                                )).reverse()}
                                </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                {!addBtn&&(
                    <Grid item xs={2}>
                        <Box component="div" style={{display: 'flex', flexDirection: 'column', paddingTop:'30px'}}><br/>
                            <TextField id="filled-basic" label="Title..." variant="filled" maxRows={5} onChange={(e) => setNewTitle(e.target.value)} value={newTitle}/>
                            <Button variant="outlined" color="primary" size="small" onClick={() => {if(window.confirm(`등록할까요?`)){onSave()}}}>Submit</Button>
                        </Box>
                    </Grid>
                )}                
            </Grid>
            <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose}>
                <Fade in={open}>
                    <div style={{background:'#fff',padding:'3rem 2rem', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', textAlign:'center'}}>
                        <h2 id="transition-modal-title" style={{margin:0}}>{selectedId}. {selectedTitle}</h2>
                    </div>
                </Fade>
            </Modal>                   
        </Container>
    );
};
export default TodoList;