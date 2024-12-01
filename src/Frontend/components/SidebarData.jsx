import React from 'react'


export const SidebarData = [
    {title: "Dashboard",
    link:"/dashboard"},
    {title: "Category List",
        link:"/event-category"},
    {title: "Events >",
        subItems:[
            {title: "Create Events", link:"/eventCreation"},
            {title: "Event List", link:"/eventList"}
        ]
        },
    {title: "Notification",
        link:"/notification"},
    {title: "Calendar",
        link:"/calendar"},
    {title: "Logout",
        link:"/logout"},
]