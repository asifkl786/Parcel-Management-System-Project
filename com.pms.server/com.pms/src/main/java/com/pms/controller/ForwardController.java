package com.pms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {
    // /api se hatkar sab routes index.html ko forward hon
    @RequestMapping(value = "/{path:^(?!api$).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}

