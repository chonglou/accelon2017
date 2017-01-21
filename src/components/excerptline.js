const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;

const styles={
	tr:{background:"white",borderBottom:"1px gray solid"},
	text:{whiteSpace:"pre",display:"block"},
	table:{width:"100%"},
	grouphit:{color:"red"},
	header:{background:"lightblue"}
}
class ExcerptLine extends React.Component {
	render() {
		var pb=this.props.address;
		pb=pb.substr(pb.indexOf("p")+1).replace(".","-");
		return E("div",{},
			this.props.header?E("div",{style:styles.header},
				this.props.header
				,"("
				,E("span",{style:styles.grouphit},this.props.grouphit)
				,")"
			)
			:null

			,E("table",{style:styles.table},
				E("tbody",{},
				E("tr",{style:styles.tr},
					E("td",{},pb),
					E("td",{style:styles.text}, this.props.text)
				)
				)
			)
		)
	}
}
module.exports=ExcerptLine;