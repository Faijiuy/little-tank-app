import './Grid.css'

export default function Grid(props){

    console.log(props)
    return(
        <div className="grid">
            {props.children}
        </div>
    )
}

