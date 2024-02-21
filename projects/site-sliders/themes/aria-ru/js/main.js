import { common } from './common.js'
import { index, about, aside, addTextHeadline, footer, header } from './index.js'
import { slider } from './slider.js'
import { tabs, accardion, modal, modalCarrer } from './pop-elem.js'
import { formSelect, formPassword, formFormater } from './form.js'
import { calc } from './calc.js'
import { calcAppendJson } from './calc-casco.js'
import { calcAccident } from './calc-accident.js'
import { calcProperty } from './calc-property.js'
import { calcSprot } from './calc-sport.js'

common()
slider()
header()
footer()
accardion()
index()
about()
formSelect()
formPassword()
formFormater()
modal()
modalCarrer()
aside()
addTextHeadline()

calcAppendJson()
calcAccident()
calcProperty()
calcSprot()
calc()
