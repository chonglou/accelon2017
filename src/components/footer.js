const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;

class Footer extends React.Component{
	render(){
		return E("div",{className:"footer"}
			,E("div",{className:"separator"},"　")
			,E("div",{style:styles.container}
			,E("table",{style:styles.table},E("tbody",{},E("tr",{}
				,E("td",{}
					,E("img",{style:styles.logoimg,src:"logo.png"}))
				,E("td",{}
					,E("div",{},"Accelon 2017.4.24")
					,E("div",{},"Freely Redistributable")
					,E("div",{},"本軟體為結緣品")
				)
			))))
		)
	}
}
const styles={
	table:{margin:"0 auto"},
	logo:{flex:1},
	logoimg:{width:80,height:80,padding:10},
	text:{flex:2}
}
module.exports=Footer;