import AddRoundedIcon from '@mui/icons-material/AddRounded';

const MainContentHeader = ({ title = "hello", actionName, actionValue = false })=> {
    return (
        <div className="main-content-header">
        <div className="main-content-header-title">
          <h1>{title}</h1>
        </div>
        
        <div className="main-content-header-button">
            {actionName ? (
                <button className="main-content-header-button-el native-button" onClick={actionValue}>
                    <span className="main-content-header-button-icon">
                        <AddRoundedIcon/>
                    </span>
                        <span className="main-content-header-button-title">
                        {actionName}
                    </span>     
                    
                </button>
            ) : null}
        </div>
      </div>
    )
}
export default MainContentHeader