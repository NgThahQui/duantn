'use client';

import React from 'react';
import Nav from "../nav/nav"; 
import "../../css/dashboard.css";

const DashboardAdminPage = () => {
  return (
    <>
    <Nav /> 
    <div id="content">
    <main>
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li>
              <a className="active" href="#">Home</a>
            </li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download bx-fade-down-hover'></i>
          <span className="text">Get PDF</span>
        </a>
      </div>

      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>1020</h3>
            <p>New Order</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>2834</h3>
            <p>Visitors</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>N$2543.00</h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Orders</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Micheal John', date: '18-10-2021', status: 'Completed' },
                { name: 'Ryan Doe', date: '01-06-2022', status: 'Pending' },
                { name: 'Tarry White', date: '14-10-2021', status: 'Process' },
                { name: 'Selma', date: '01-02-2023', status: 'Pending' },
                { name: 'Andreas Doe', date: '31-10-2021', status: 'Completed' },
              ].map((order, idx) => (
                <tr key={idx}>
                  <td>
                    {/* <img src="https://placehold.co/600x400/png" alt={order.name} /> */}
                    <p>{order.name}</p>
                  </td>
                  <td>{order.date}</td>
                  <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="todo">
          <div className="head">
            <h3>Todos</h3>
            <i className='bx bx-plus icon'></i>
            <i className='bx bx-filter'></i>
          </div>
          <ul className="todo-list">
            {[
              { task: 'Check Inventory', done: true },
              { task: 'Manage Delivery Team', done: true },
              { task: 'Contact Selma: Confirm Delivery', done: false },
              { task: 'Update Shop Catalogue', done: true },
              { task: 'Count Profit Analytics', done: false },
            ].map((todo, idx) => (
              <li key={idx} className={todo.done ? 'completed' : 'not-completed'}>
                <p>{todo.task}</p>
                <i className='bx bx-dots-vertical-rounded'></i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
    </div>
    </>
  );
};

export default DashboardAdminPage;
