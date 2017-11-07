/**
 * @module Validation
 * @name  数据校验工具
 * @description 用于校验指定对象数据是否符合规范
 * 
 * @example
 *      
 *       const obj = { username:'张三',password:'李四' }
 *      
 *       const partten = {
 *          username: { required: '请输入用户名' },
 *          password: { required: '请输入密码' }
 *       }
 * 
 *       if(validator.model(obj,partten)){
 *           do something.....
 *       }
 */

import { Validator } from 'dantejs'

/**
 *  默认支持的校验规则如下:
 *   
 *  1. 非空校验: required  例如: 
 * 
 *     const rules = { 
 *         name: { required:'名称不能为空'  }  
 *     }
 * 
 *  2. 两项必填某一项 twoRequired 例如: 
 *     const obj = { name:'张三','alias':''}
 *     const rules = { 
 *         name: { twoRequired:['alias','姓名与别名至少填写一项']  }  
 *     }
 * 
 *  3. 邮箱验证:
 *     const rules = { 
 *         userEmail: { email:'请填写正确的邮箱'  }  
 *     }
 *  4. 时间校验 (date,dateISO):
 *     const rules = { 
 *         birthday: { date:'请输入有效的日期'  } ,
 *         createDate:{ dateISO:'请输入有效的日期 (YYYY-MM-DD)' },
 *     }
 *  5. 数字校验 (number(整数格式校验器),digits)
 *     const rules = { 
 *         orderPrice: { number:'请输入有效的数字'  } ,
 *         buyNum : { digits:'只能输入数字(可包含小数)' },
 *     }
 *  6. 信用卡卡号校验(creditcard)
 *     const rules = { 
 *         bankCard: { creditcard:'请输入有效的信用卡号码'  }
 *     }
 *  7. 最小长度验证(minlength)
 *     const rules = { 
 *         userName: { minlength:[10,'最少要输入 {0} 个字符']  }
 *     }
 *  8. 最大长度验证(maxlength)
 *     const rules = { 
 *         userName: { maxlength:[10,'最多可以输入 {0} 个字符']  }
 *     }
 *  9. 长度范围验证(rangelength)
 *     const rules = { 
 *         userName: { rangelength:[5,8,'用户名长度至少在{0} 到{1} 个字符之间']  }
 *     }
 *  11. 最小值验证(min)
 *     const rules = { 
 *         buyNum: { min:[5,'购买数量不能小于{0}个']  }
 *     }
 *  12. 最小值验证(max)
 *     const rules = { 
 *         buyNum: { max:[10,'购买数量不能超过{0}个']  }
 *     }
 *  13. 最小值验证(range) 释义： buyNum >=5 && buyNum<=10
 *     const rules = { 
 *         buyNum: { range:[5,10,'购买数量只能在{0} 到{1}个之间']  }
 *     }
 *  14. 手机号验证(mobile)
 *     const rules = { 
 *         buyNum: { mobile:'请输入有效的手机号码'  }
 *     }
 *  15. 电话号码验证(tel)
 *     const rules = { 
 *         buyNum: { mobile:'请输入有效的电话号码'  }
 *     }
 *  16. 当前值是否和指定属性值相等校验(equalTo)
 *     const obj = { password:'xxx',confirmPassword:'xx' }
 *     const rules = { 
 *         password: { equalTo:['confirmPassword','两次密码不一致']  }
 *     }
 *  17.判断当前属性必须小于指定属性值 (minTo)
 *     const rules = { 
 *         buyNum: { minTo:['stockNum','购买数量不能大于库存数量']  }
 *     }
 *  18.判断当前属性值必须大于指定属性值 （maxTo）
 *     const rules = { 
 *         buyNum: { maxTo:['minBuyNum','购买数量不能小于起购数量']  }
 *     }
 *  19.中华人民共和国身份证校验 (包括二代身份证以及老身份证校验)
 *    const rules = { 
 *         idCard: { idCard:'请输入有效的身份证'  }
 *     }
 */

 //扩展校验器
 /*

  //1.不带参数验证器
  Validator.registerRule('myName',(value)=>{
      return value ==="张三";
  })

  //使用:

  const rules = {
    name: {myName:'必须填写张三哈哈'}
  }
 
  //2. 带配置参数验证器

  Validator.registerRule('equalValue',(value,equalValue)=>{
      //equalValue 为配置的值
      return value === equalValue;
  })

  //使用:

  const rules ={
    name:{ equalValue:['李四','填写的名称必须为李四.....'] }

  }

*/

export default Validator;