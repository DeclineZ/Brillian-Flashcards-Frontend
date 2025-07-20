import{u as d,a as h,j as e}from"./index-fqoWOEOd.js";import{c as t}from"./createLucideIcon-CvVNInVQ.js";/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],x=t("book",g);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],p=t("circle-question-mark",m);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],y=t("cpu",u);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],f=t("globe",k);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],v=t("image",b),w=[{id:"visual",label:"Visual Learner",desc:"I grasp concepts fastest with images, diagrams, or videos.",Icon:v,color:"bg-purple-100 text-purple-700"},{id:"realworld",label:"Real-World Learner",desc:"I learn best through hands-on examples and practical cases.",Icon:f,color:"bg-green-100 text-green-700"},{id:"logical",label:"Logical Learner",desc:"I prefer patterns, numbers, and cause-and-effect reasoning.",Icon:y,color:"bg-blue-100 text-blue-700"},{id:"verbal",label:"Verbal / Text-Based Learner",desc:"Give me words—summaries, definitions, or sequenced steps.",Icon:x,color:"bg-orange-100 text-orange-700"},{id:"unsure",label:"I'm not sure yet",desc:"Help me discover a blend that works for me.",Icon:p,color:"bg-gray-100 text-gray-600"}];function M(){const s=d(),{setLearningPrefs:r}=h();function o(a){r({visual:a==="visual"?1:0,verbal:a==="verbal"?1:0,logical:a==="logical"?1:0,realworld:a==="realworld"?1:0}),s("/create")}return e.jsx("div",{className:"min-h-screen w-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6",children:e.jsxs("div",{className:"w-full max-w-3xl space-y-8",children:[e.jsxs("header",{className:"text-center space-y-2",children:[e.jsxs("h1",{className:"text-3xl md:text-4xl font-extrabold text-gray-900",children:["How do ",e.jsx("span",{className:"text-indigo-600",children:"you"})," learn best?"]}),e.jsx("p",{className:"text-gray-600 max-w-lg mx-auto",children:"Pick the style that feels most natural. We'll tailor flashcards and explanations to match your preference—no wrong answers here!"})]}),e.jsx("div",{className:"grid gap-6 md:grid-cols-2",children:w.map(({id:a,label:n,desc:c,Icon:l,color:i})=>e.jsxs("button",{onClick:()=>o(a),className:"group relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200",children:[e.jsx("div",{className:`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${i}`,children:e.jsx(l,{size:24})}),e.jsxs("div",{className:"text-left",children:[e.jsx("h3",{className:"font-semibold text-lg text-gray-900",children:n}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:c})]}),e.jsx("span",{className:"absolute inset-0 rounded-xl ring-1 ring-transparent transition group-hover:ring-indigo-300"})]},a))})]})})}export{M as default};
