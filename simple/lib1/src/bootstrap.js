import ReactDom from "react-dom";
import React from "react"; // <- this is a shared module, but used as usual
import Component from "./Component"
import { de } from "date-fns/locale";

// load app
const el = document.createElement("main");
ReactDom.render(
	<div>
		<h1>Lib 1</h1>
		<Component locale={de} />
	</div>,
	el
);
document.body.appendChild(el);
