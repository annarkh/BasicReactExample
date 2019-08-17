import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import data from './data'

const mainConteiner = {
    display: "flex",
};
const leftPanelStyle = {
    maxWidth: "300px",
};
const item = {
    listStyleType: "none",
    textAlign: "left",
};
const pos = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5em",
    width:"100%",
};
const total = {
    position: "fixed",
    width: "100%",
    top: "33em",
    background: "#efefef",
    border: "1px solid #ccc"
};
const sizeTable = {
    border: "1px solid #ccc",
    align: "center",
    cellPadding: "20",
    margin: "1em",
    fontSize: "14px",

};
const sizeStr = {
    border: "1px solid #ddd",
    padding: "5px",
    borderRadius: "3px",
    width: "10%"
};

function TotalAmount(props) {
    let sendPost = () => {
        axios.post('https://datainlife.ru/junior_task/add_basket.php', props.data)
    };
    return <div>
        <div>{props.total}</div>
        <button onClick={sendPost}>В корзину</button>
    </div>
}

function Str(props) {
    let [count, setCount] = useState(0);
    let {handleChange} = props;
    let {gid, gname, gprice} = props.tableData;
    let subSum = gprice * count;
    return <tr>
        <td style={sizeStr}>{gid}</td>
        <td style={sizeStr}>{gname}</td>
        <td style={sizeStr}>{gprice}</td>
        <td style={sizeStr}><input type="number"
                                   min="0"
                                   value={count}
                                   onChange={(event) => {
                                       setCount(+event.target.value);
                                       handleChange(gid, +event.target.value, gprice * event.target.value);
                                   }}/></td>
        <td style={sizeStr}>{subSum}</td>
    </tr>
}

function Table(props) {
    let {tableData, handleChange} = props;
    return <table style={sizeTable}>
        <thead>
        <tr>
            <th colSpan={5}>{tableData.rname}</th>
        </tr>
        </thead>
        <tbody>
        {
            tableData.goods.map((it, j) => {
                return <Str key={j} tableData={it} handleChange={handleChange}/>
            })
        }
        </tbody>
    </table>;
}

function LeftPanelItem(props) {
    let {gname, setSeeCatigory, updateCount} = props;

    let sendObject = () => {
        setSeeCatigory([<Table tableData={gname} key={0} handleChange={updateCount}/>])
        window.scrollTo(0,0);
    };
    return <li style={{marginBottom:"1em"}} onClick={sendObject}>{gname.rname}</li>
}

function App() {
    let [categories, setCategories] = useState([]);
    let [counts, setCounts] = useState({});
    let [categoryLinks, setCategoryLinks] = useState([]);
    let [seeCatigory, setSeeCatigory] = useState([]);
    let updateCount = (id, count, price) => {
        setCounts(prevCounts => ({...prevCounts, [id]: [count, price]}))
    };
    let seeAll =()=>{
        setSeeCatigory(categories);
        window.scrollTo(0,0);
    };
    let totalSum = 0;
    for (let key in counts) {
        totalSum += counts[key][1];
    }
    let countsToSend = {
        success: true,
        data: {
            product: {}
        }
    };
    for (let key in counts) {
        countsToSend.data.product[key] = counts[key][0]
    }
    useEffect(() => {
        axios.get(`https://datainlife.ru/junior_task/get_products.php`)
            .then(res => {
                let cats = [];
                let catLinks = [];
                res.data.map((item, i) => {
                    if (item.goods !== undefined) {
                        cats.push(<Table tableData={item} key={i} handleChange={updateCount}/>)
                        catLinks.push(<LeftPanelItem gname={item} setSeeCatigory={setSeeCatigory} updateCount={updateCount}/>)
                    }
                });
                setCategories([...cats]);
                setCategoryLinks([...catLinks]);
            })
    }, []);

    return (
        <div className="App">
            <div style={mainConteiner}>
                <div style={leftPanelStyle}>
                    <ul style={item}>
                        <li onClick={seeAll}>Показать все товары</li>
                        {
                            categoryLinks.map((item) => {
                                return item
                            })
                        }
                    </ul>
                </div>
                <div style={pos}>
                    {
                        seeCatigory.map((item, i) => {
                            return item
                        })
                    }
                </div>
            </div>
            <div style={total}>
                <TotalAmount total={totalSum.toFixed(2)} data={countsToSend}/>
            </div>
        </div>
    );

}
export default App;
