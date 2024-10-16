import React from "react"
import ItemDisplaySettings from "../components/Settings-displayItems"

export default function Settings({settings, isMobile}){
   return(
      <>
         <ItemDisplaySettings settings={settings} isMobile={isMobile}/>
      </>
   )
}