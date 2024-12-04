import React, { useState, useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios';



function EditEvent(){
    const navigate = useNavigate();
    const location = useLocation();
    const {event} = location.state || {};
    const [token, setToken] = useState('');
    const [localEvent, setLocalEvent] = useState(event);
    const [error, setError] = useState(null);

    useEffect(() =>{

        const storedToken = localStorage.getItem('token');
        if(storedToken){
            setToken(storedToken);
        }

    }, [])

    const editEvent = async() => {
        if(!token){ //because these arent initialized right away
            return;
          }
        try{
            
            
            const response = await axios.patch(`http://localhost:3000/events/edit/${localEvent.eventID}`,  
                {
                    event_title: localEvent.event_title,
                    event_description: localEvent.event_description,
                    eventStart_date: localEvent.eventStart_date,
                    eventEnd_date: localEvent.eventEnd_date,
                    location: localEvent.location,
                    userID: localEvent.userID,
                    categoryID: localEvent.categoryID
                    //why do different axios methods have different payload format
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                } 
            );
            if(response && response.data){
                navigate("/eventList")
            }
        }catch(e){
            setError('Could not edit category. Please try again later.')
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        editEvent();
    }
    
    return(
        <div>
            <button onClick={()=> { navigate("/eventList")}}>Back</button>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Event Title" value= {localEvent.event_title} onChange={(e) => {setLocalEvent({...localEvent, event_title : e.target.value})}}/>
                <input type="text" placeholder="Event Description" value= {localEvent.event_description} onChange={(e) => {setLocalEvent({...localEvent, event_description: e.target.value})}}/>
                <input type="text" placeholder="Event Location" value= {localEvent.location} onChange={(e) => {setLocalEvent({...localEvent, location: e.target.value})}}/>
                <input type="date" placeholder="Event Start Date" value= {localEvent.eventStart_date} onChange={(e) => {setLocalEvent({...localEvent, eventStart_date: e.target.value})}}/>
                <input type="date" placeholder="Event End Date" value= {localEvent.eventEnd_date} onChange={(e) => {setLocalEvent({...localEvent, eventEnd_date: e.target.value})}}/>
                <button type="submit">Update</button>   
            </form>
        </div>
    )
}
export default EditEvent;