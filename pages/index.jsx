import Head from 'next/head'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { Menu, Input, Calendar, TimePicker, Dropdown } from 'antd'

import 'antd/dist/antd.css'

export async function getStaticProps() {
  const res = await fetch('https://calendar-editor.theneuron.repl.co/api/schedule')
  const schedule = await res.json()

  return { props: schedule }
}

export default function Home(props) {
  const [schedule, set_schedule] = useState({})
  const [popup, set_popup] = useState({show:false})

  useEffect(() => set_schedule(props))

  const edit_schedule = new_schedule => {
    fetch('https://calendar-editor.theneuron.repl.co/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(new_schedule),
    })
    .then(() => {})
    .catch(() => console.error('Error Updating Schedule'))

    console.log(schedule)
    set_schedule(new_schedule)
  }

  const change_color = color => {
    let new_schedule = Object.assign({}, schedule)
    if (!new_schedule[popup.date])
      new_schedule[popup.date] = {color: 'transparent',events:[]}
    new_schedule[popup.date].color = color
    edit_schedule(new_schedule)
    set_popup({show:true,date:popup.date,day_color:color,events:popup.events})
  }

  const change_event = (attr, info, event_index) => {
    let new_schedule = schedule
    new_schedule[popup.date].events[event_index][attr] = info
    new_schedule[popup.date].events.sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`))
    edit_schedule(new_schedule)
    set_popup({
      show: true,
      date: popup.date,
      day_color: popup.day_color,
      events: new_schedule[popup.date].events
    })
  }

  const add_event = () => {
    let new_schedule = Object.assign({}, schedule)
    if (!new_schedule[popup.date])
      new_schedule[popup.date] = {color: 'transparent',events:[]}
    new_schedule[popup.date].events.unshift({'time':'12:00 AM','name':'','occasion':'none'})
    edit_schedule(new_schedule)
    set_popup({
      show: true,
      date: popup.date,
      day_color: popup.day_color,
      events: new_schedule[popup.date].events
    })
  }

  const delete_event = i => {
    let new_schedule = schedule
    new_schedule[popup.date].events.splice(i, 1)
    edit_schedule(new_schedule)
    set_popup({
      show: true,
      date: popup.date,
      day_color: popup.day_color,
      events: new_schedule[popup.date].events
    })
  }

  return (
    <div id="app">
      <Head>
        <title>Calendar Editor</title>
        <meta name="description" content="Editor for Menelik's Monitor Dashboard app" />
      </Head>

      <main>
        <Calendar onPanelChange={ e => set_popup({show:false}) }
                  onSelect={date => {
                    const day = date.format('MMMM D, YYYY')
                    set_popup({
                      date: day,
                      show: true,
                      events: schedule[day] ? schedule[day].events : [],
                      day_color: schedule[day] ? schedule[day].color : 'transparent'
                    })
                  }}
                  dateFullCellRender={ date =>
                    <div className="ant-picker-cell-inner ant-picker-calendar-date">
                      <div className="ant-picker-calendar-date-value">
                        { date.format('D') }
                        <div style={{width:'100%',height:'10px',backgroundColor: schedule[date.format('MMMM D, YYYY')] ? schedule[date.format('MMMM D, YYYY')].color : 'transparent'}}></div>
                      </div>
                      <div className="ant-picker-calendar-date-content">
                        <ul className="events" style={{color: schedule[date.format('MMMM D, YYYY')] ? schedule[date.format('MMMM D, YYYY')].color : 'black'}}>
                          { schedule[date.format('MMMM D, YYYY')]
                            ? schedule[date.format('MMMM D, YYYY')].events.map((event, i) => <li key={i}>{ event.name }</li>)
                            : null }
                        </ul>
                      </div>
                    </div>
                  }
                  />

        { popup.show
          ? <div id="edit">
              <svg width="40" height="40" className="close-popup" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={ e => set_popup({show:false}) }><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" /></svg>
              <div className="popup-header">
                <h1>{ popup.date }</h1>
                <Dropdown overlay={
                            <Menu style={{borderRadius:'10px',padding:'10px 0 10px 10px'}}>
                              <div className="circle transparent-color" onClick={ () => change_color('transparent') }></div>
                              <div className="circle orange-color" onClick={ () => change_color('orange') }></div>
                              <div className="circle blue-color" onClick={ () => change_color('blue') }></div>
                              <div className="circle grey-color" onClick={ () => change_color('grey') }></div>
                            </Menu>
                          }>
                  <div className={`circle ${popup.day_color}-color`}></div>
                </Dropdown>
              </div>
        
              <div id="add-event" onClick={ add_event }>
                + Add event
              </div>

              <div id="events">
                { popup.events.map((event, i) => (
                    <div className="event-desc">
                      <Dropdown overlay={
                                  <Menu style={{borderRadius:'10px',padding:'10px 0 10px 10px'}}>
                                    <div className="occasion none-color" onClick={ () => change_event('occasion', 'none', i) }></div>
                                    <div className="occasion party-color" onClick={ () => change_event('occasion', 'party', i) }></div>
                                    <div className="occasion sad-color" onClick={ () => change_event('occasion', 'sad', i) }></div>
                                  </Menu>
                                }>
                        <div className={`occasion ${event.occasion}-color`}></div>
                      </Dropdown>
                      <TimePicker format="h:mm A"
                                  use12Hours={true}
                                  allowClear={false}
                                  value={moment(event.time, 'h:mm A')}
                                  onChange={ (time, _) => change_event('time', time.format('h:mm A'), i) } />
                      <input className="event-input"
                             value={event.name}
                             placeholder="Event Name"
                             onChange={ e => change_event('name', e.target.value, i) } />
                      <svg width="20" height="20" className="delete-event" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={ () => delete_event(i) }><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" /></svg>
                    </div>
                  )) }
              </div>
            </div>
          : null }
      </main>
    </div>
  )
}