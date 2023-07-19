export default {
  type: 'object',
  properties: {
    list: {
      title: '收藏网址列表',
      type: 'array',
      widget: 'CardList',
      defaultValue: [{}],
      items: {
        type: 'object',
        widget: 'card',
        title: 'List.Item',
        properties: {
          input1: {
            title: '网址名字',
            type: 'string',
          },
          input2: {
            title: '网址链接',
            type: 'string',
          },
          jump: {
            // 指定为刚刚注册的 widget
            widget: 'JumpButton',
            props: {
              // 当 age 字段更新时，自定义组件 MyInput 会接收到最新的 age 属性
              hrefUrl: '{{ formData.list }}' 
          }
          }
        }
      }
    }
  }
};