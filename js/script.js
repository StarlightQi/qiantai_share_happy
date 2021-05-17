class Steps {
  constructor(wizard) {
    this.wizard = wizard;
    this.steps = this.getSteps();
    this.stepsQuantity = this.getStepsQuantity();
    this.currentStep = 0;
  }

  setCurrentStep(currentStep) {

    this.currentStep = currentStep;
  }

  getSteps() {
    return this.wizard.getElementsByClassName('step');
  }

  getStepsQuantity() {
    return this.getSteps().length;
  }

  handleConcludeStep() {
    this.steps[this.currentStep].classList.add('-completed');
  }

  handleStepsClasses(movement) {
    console.log("I am here")
    if (movement > 0)
    this.steps[this.currentStep - 1].classList.add('-completed');else
    if (movement < 0)
    this.steps[this.currentStep].classList.remove('-completed');
  }}


class Panels {
  constructor(wizard) {
    this.wizard = wizard;
    this.panelWidth = this.wizard.offsetWidth;
    this.panelsContainer = this.getPanelsContainer();
    this.panels = this.getPanels();
    this.currentStep = 0;

    this.updatePanelsPosition(this.currentStep);
    this.updatePanelsContainerHeight();
  }

  getCurrentPanelHeight() {
    return `${this.getPanels()[this.currentStep].offsetHeight}px`;
  }

  getPanelsContainer() {
    return this.wizard.querySelector('.panels');
  }

  getPanels() {
    return this.wizard.getElementsByClassName('panel');
  }

  updatePanelsContainerHeight() {
    this.panelsContainer.style.height = this.getCurrentPanelHeight();
  }

  updatePanelsPosition(currentStep) {
    const panels = this.panels;
    const panelWidth = this.panelWidth;

    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.remove(
      'movingIn',
      'movingOutBackward',
      'movingOutFoward');

      if (i !== currentStep) {
        if (i < currentStep) panels[i].classList.add('movingOutBackward');else
        if (i > currentStep) panels[i].classList.add('movingOutFoward');
      } else {
        panels[i].classList.add('movingIn');
      }
    }

    this.updatePanelsContainerHeight();
  }

  setCurrentStep(currentStep) {
    this.currentStep = currentStep;
    this.updatePanelsPosition(currentStep);
  }}


class Wizard {
  constructor(obj) {
    this.wizard = obj;
    this.panels = new Panels(this.wizard);
    this.steps = new Steps(this.wizard);
    this.stepsQuantity = this.steps.getStepsQuantity();
    this.currentStep = this.steps.currentStep;

    this.concludeControlMoveStepMethod = this.steps.handleConcludeStep.bind(this.steps);
    this.wizardConclusionMethod = this.handleWizardConclusion.bind(this);
  }

  updateButtonsStatus() {

    if (this.currentStep === 0)
    this.previousControl.classList.add('disabled');else

    this.previousControl.classList.remove('disabled');
  }

  updtadeCurrentStep(movement) {
    this.currentStep += movement;
    this.steps.setCurrentStep(this.currentStep);
    this.panels.setCurrentStep(this.currentStep);

    this.handleNextStepButton();
    this.updateButtonsStatus();
  }

  handleNextStepButton() {
    if (this.currentStep === this.stepsQuantity - 1) {
      this.nextControl.innerHTML = '完成！';
      this.nextControl.removeEventListener('click', this.nextControlMoveStepMethod);
      this.nextControl.addEventListener('click', this.concludeControlMoveStepMethod);
      this.nextControl.addEventListener('click', this.wizardConclusionMethod);
    } else {
      if(this.currentStep!==0){
      layui.use('layer', function(){ //独立版的layer无需执行这一句
        layer.open({
          type: 1,
          title:"发送邮箱",
          id: 'LAY_sss'
          ,area: '300px;'
          ,shade: 0.8
          ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 200;">' +
              '\t<fieldset class="layui-elem-field layui-field-title"">\n' +
              '\t\t<legend>Java 学习论坛</legend>\n' +
              '\t</fieldset>' +
              '我们将发送验证码到到您邮箱中是否发送？^_^</div>' //这里content是一个普通的String
          ,btn: ['发吧发吧', '残忍拒绝']
          ,yes:function(index, layero){
            $.ajax({
              url:"http://127.0.0.1:8066/authorAdmin/sendCode?"+"email="+$("#email").val(),//请求的路径
              type:"POST",//请求的方式
              success:function(date){
               if (date.success)
                 layer.msg("邮箱已经发送到您邮箱请注意接收");
                else
                 layer.msg("该邮箱已经发送过信息，请3分钟后在重试");
              }
            });
            layer.close(index);
          },
          btn2:function(index, layero){
            layer.msg("以后在见吧")
            window.location.href="/"
          },
        });
      });
      }
      this.nextControl.innerHTML = '下一步';
      // alert("这是第一个按钮")
      this.nextControl.addEventListener('click', this.nextControlMoveStepMethod);
      this.nextControl.removeEventListener('click', this.concludeControlMoveStepMethod);
      this.nextControl.removeEventListener('click', this.wizardConclusionMethod);
    }
  }

  handleWizardConclusion() {
    var _this=this;
    $.ajax({
      url:"http://127.0.0.1:8066/authorAdmin/register",//请求的路径
      type:"POST",//请求的方式
      contentType: 'application/json',
      data:JSON.stringify({useremain:$("#email").val() ,userpassword:$("#password").val(),username:$("#name").val(),code:$("#code").val()}),
      dataType: "json",
      success:function(date){
        console.log(date)
        if (date.success){
          _this.wizard.classList.add('completed');
          layer.msg("注册成功！");
          setTimeout(function () {
            location.href="index.html";
          },3000)
          }
        else{
          layui.use('layer', function() { //独立版的layer无需执行这一句
            layer.msg("验证码错误，请程序输入")
          });
        }
      },
      error:function(){
        //请求出现错误时
      }
    });

  }

  addControls(previousControl, nextControl) {
    this.previousControl = previousControl;
    this.nextControl = nextControl;
    this.previousControlMoveStepMethod = this.moveStep.bind(this, -1);
    this.nextControlMoveStepMethod = this.moveStep.bind(this, 1);
    previousControl.addEventListener('click', this.previousControlMoveStepMethod);
    nextControl.addEventListener('click', this.nextControlMoveStepMethod);
    this.updateButtonsStatus();
  }

  moveStep(movement) {
    if (this.validateMovement(movement)) {
      this.updtadeCurrentStep(movement);
      this.steps.handleStepsClasses(movement);
    } else {
      throw 'This was an invalid movement';
    }
  }

  validateMovement(movement) {

    const fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
    const backMov = movement < 0 && this.currentStep > 0;

    return fowardMov || backMov;
  }}


let wizardElement = document.getElementById('wizard');
let wizard = new Wizard(wizardElement);
let buttonNext = document.querySelector('.next');
let buttonPrevious = document.querySelector('.previous');

wizard.addControls(buttonPrevious, buttonNext);
