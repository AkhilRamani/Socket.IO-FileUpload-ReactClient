import React from 'react';

const ProgressBar = ({ percent }) => {
    
    return(
        <>
          <div style={{ display: 'flex', justifyContent:'space-between', alignItems: 'center'}} > 
            <div style={{width: '100%', marginRight: 8}}> 
                <div id="myProgress" style={{ backgroundColor: '#f5f5f5', borderRadius: 50 }}>
                    <div id="myBar"
                        style={{width: `${percent}%`, 
                                height: 3, backgroundColor: `${percent === 100 ? '#52c41a' : '#40a9ff'}`,
                                transitionDuration: '0.2s', 
                                borderRadius: 50}}></div>
                </div> 
            </div>
            {percent === 100 ? <span style={{
                                        backgroundColor: '#52c41a',
                                        fontSize: 12,
                                        width: 14,
                                        height: 13,
                                        color: '#ffffff',
                                        fontWeight: 900,
                                        border: '1px solid rgb(82, 196, 26)',
                                        margin: '-1px 0px 0 3px',
                                        borderRadius: 50 }}>&#10003;</span>
                             :  <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)'}}>{percent}%</span>}
          </div>  
        </>
    );
}

export default ProgressBar;