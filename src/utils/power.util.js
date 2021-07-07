function sort(data) {
  data.forEach(i => {
    if (i.children != null && i.children.length > 0){
      sort(i.children)
      i.children.sort((a, b) => {
        return a.PowerOrder - b.PowerOrder
      })
    }
  })

  data.sort((a, b) => {
    return a.PowerOrder - b.PowerOrder
  })

  return data
}

export function format(data) {
  var result = []
  data.forEach(i => {
    if(i.PowerId.length === 3){
      i["children"] = []
      data.forEach(j => {
        if (j.MotherId === i.PowerId){
          j["children"] = []
          data.forEach(k => {
            if (k.MotherId === j.PowerId){
              j.children.push(k)
            }
          })
          i.children.push(j)
        }
      })
      result.push(i)
    }
  })
  return sort(result)
}

export function findPower(powerId, powerList) {
  var result = null
  if (powerId.length === 3){
    powerList.forEach(i => {
      if (i.PowerId === powerId){
        result = i
      }

    })
  }
  else if (powerId.length === 6){
    powerList.forEach(i => {
      if (i.children != null && i.children.length > 0)
      i.children.forEach(j => {
        if (j.PowerId === powerId)
          result = j
      })
    })
  }
  else if (powerId.length === 9){
    console.log(3)
    powerList.forEach(i => {
      if (i.children != null && i.children.length > 0)
      i.children.forEach(j => {
        if (j.children != null && j.children.length > 0){
          j.children.forEach(k => {
            if (k.PowerId === powerId)
              result = k
          })
        }
      })
    })
  }
  return result
}

export function simplify(powerList) {
  var result = []
  powerList.forEach(item => {
    if (item.length === 3 && result.indexOf(item) === -1)
      result.push(item)
  })

  powerList.forEach(item => {
    if (item.length === 6 && result.indexOf(item.slice(0, 3)) === -1 && result.indexOf(item) === -1){
      result.push(item)
    }
  })

  powerList.forEach(item => {
    if (item.length === 9 && result.indexOf(item.slice(0, 3)) === -1 && result.indexOf(item.slice(0, 6)) === -1 && result.indexOf(item) === -1){
      result.push(item)
    }
  })

  return result
}