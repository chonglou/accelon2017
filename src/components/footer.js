const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;


class Footer extends React.Component{
	render(){
		return E("div",{className:"footer"}
			,E("div",{className:"separator"},"　")
			,E("div",{},"Powered By Ksana Search Engine")
			,E("div",{},E("a",{target:"_new",href:"http://www.ksana.tw"},"www.ksana.tw"))
			,E("div",{},"Version: 2017.3.11")
			,E("div",{},"　")
		)
	}
}

module.exports=Footer;