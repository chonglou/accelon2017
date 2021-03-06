const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const {_}=require("ksana-localization");
const address=require("../model/address");
const mode=require("../model/mode");
class GoPage extends React.Component {
	constructor(props){
		super(props)
		this.state={page:""}
	}
	gopage(){
		const book=this.props.cor.bookOf(address.store.main);
		const pg=(parseInt(this.state.page,10)-1)||0;
		const r=this.props.cor.parseRange(book+"p"+this.state.page);
		const kpos=r?r.start:this.props.cor.makeKPos([book,pg,0,0]);

		const article=this.props.cor.articleOf(kpos);
		if (!article)return;
		const addr=this.props.cor.stringify(kpos);
		address.setMain(addr);
		mode.readText();
	}
	setRef(ref){
		this.input=ref;
	}
	onChange(e){
		this.setState({page:e.target.value});
	}
	onKeyPress(e){
		if (e.key==="Enter") this.gopage();
	}
	render(){
		return E("span",{className:"gotopage"},
			E("button",{onClick:this.gopage.bind(this)},_("Page Number"))
			,E("input",{ref:this.setRef.bind(this),value:this.state.page,size:5,
				onChange:this.onChange.bind(this),onKeyPress:this.onKeyPress.bind(this)})
		)
	}
};
GoPage.propTypes={
	cor:PT.object.isRequired,
	range:PT.array.isRequired,
}
module.exports=GoPage;