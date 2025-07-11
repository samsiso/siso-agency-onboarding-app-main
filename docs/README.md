# SISO Agency Platform - Agent Documentation Hub

## 📚 **Documentation Overview**

This directory contains comprehensive documentation for the Claude Code agent working with the SISO Agency Onboarding Platform.

## 🗂️ **Document Index**

### **Agent Capabilities & Reference**
- **[AGENT-CAPABILITIES-REFERENCE.md](./AGENT-CAPABILITIES-REFERENCE.md)** - Complete overview of agent tools and capabilities
- **[MCP-TOOLS-REFERENCE.md](./MCP-TOOLS-REFERENCE.md)** - Detailed MCP tool documentation and usage patterns
- **[AGENT-ACTION-MATRIX.md](./AGENT-ACTION-MATRIX.md)** - All possible actions organized by category and complexity

### **Strategic Planning**
- **[AGENT-IMPROVEMENT-PLAN.md](./AGENT-IMPROVEMENT-PLAN.md)** - Comprehensive roadmap for agent enhancement
- **[CLAUDE-AUTONOMOUS-AGENT-RULES.md](./CLAUDE-AUTONOMOUS-AGENT-RULES.md)** - Autonomous behavior guidelines

### **Technical Documentation**
- **[SUPABASE-MCP-INTEGRATION.md](./SUPABASE-MCP-INTEGRATION.md)** - Database workflow and integration
- **[GITHUB-AUTOMATION-WORKFLOW.md](./GITHUB-AUTOMATION-WORKFLOW.md)** - Git automation and workflows

### **Database Schema**
- **[../database-schema/](../database-schema/)** - Complete database documentation (70 tables)

### **Development Templates**
- **[templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md](./templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md)** - Code templates and patterns

## 🎯 **Quick Reference**

### **Agent Core Capabilities**
1. **File Operations**: Read, write, edit, search across codebase
2. **Database Operations**: Supabase integration (requires auth token)
3. **UI Generation**: React components via 21st.dev Magic
4. **Browser Automation**: Playwright/Puppeteer for testing
5. **Task Management**: Planning and workflow automation
6. **Development Tools**: Build, test, deploy, git operations

### **Key Limitations**
- ⚠️ **Supabase MCP**: Requires `SUPABASE_ACCESS_TOKEN` environment variable
- ⚠️ **Memory**: No persistence between sessions
- ⚠️ **File Access**: Limited to allowed directories (configurable)

### **Most Important Tools**
1. **Supabase MCP** - Database operations and backend management
2. **21st Dev Magic** - UI component generation and enhancement
3. **Task Manager** - Project planning and workflow management
4. **Playwright** - Browser automation and testing
5. **Desktop Commander** - Enhanced file system operations

## 🚀 **Getting Started**

### **For New Sessions**
1. Read `AGENT-CAPABILITIES-REFERENCE.md` for overview
2. Check `AGENT-ACTION-MATRIX.md` for specific actions needed
3. Reference `MCP-TOOLS-REFERENCE.md` for tool usage
4. Review database schema in `../database-schema/`

### **For Development Tasks**
1. Use autonomous development rules from `CLAUDE-AUTONOMOUS-AGENT-RULES.md`
2. Follow patterns in `templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md`
3. Reference Supabase integration guide for database work
4. Use GitHub automation for code management

### **For Improvements**
1. Review `AGENT-IMPROVEMENT-PLAN.md` for enhancement roadmap
2. Implement priority fixes (Supabase auth, memory persistence)
3. Add new capabilities based on business needs
4. Follow continuous improvement cycle

## 📊 **Project Context**

### **SISO Agency Platform Overview**
- **Tech Stack**: Vite + React + TypeScript + Supabase
- **Database**: 70 tables with comprehensive business logic
- **Features**: Client management, task tracking, Instagram marketing, financial management
- **Users**: Agency owners, team members, clients

### **Agent Role**
- **Primary**: Autonomous development and business process automation
- **Secondary**: Code analysis, optimization, and maintenance
- **Advanced**: Business intelligence and predictive analytics

## 🔄 **Update Cycle**

This documentation should be updated:
- **Weekly**: Performance metrics and new capabilities
- **Monthly**: Tool enhancements and workflow improvements
- **Quarterly**: Strategic roadmap and business alignment

## 📞 **Support & Enhancement**

For agent improvements or new capabilities:
1. Review improvement plan priorities
2. Check tool documentation for existing solutions
3. Implement enhancements following documented patterns
4. Update documentation with new capabilities

---

**Last Updated**: Current session
**Version**: 1.0 - Comprehensive initial documentation
**Next Review**: After implementing Supabase authentication