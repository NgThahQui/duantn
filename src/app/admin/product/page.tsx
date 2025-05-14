'use client';

import Nav from "../nav/nav"; 
import Link from 'next/link';
import React from "react";
export default function ProductAdminPage(){
    return(
        <>
          <Nav/> 
          <div id="content">
            <main>
                <div className="head-title">
                <div className="left">
                    <h1>Product</h1>
                    <ul className="breadcrumb">
                        <li><Link href="/admin/product">Product</Link></li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li><Link className="active" href="/admin/product">Home</Link></li>
                    </ul>
                </div>
                </div>
                
                </main>
            </div>
        </>
      
        
    )
}